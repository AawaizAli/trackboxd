import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { getPlaylistDetails } from "@/lib/spotify";

export async function GET(req: NextRequest) {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        // Get the 5 most recent playlist likes
        const { data: recentLikes, error: likesError } = await supabase
            .from("likes")
            .select("target_id, created_at")
            .eq("target_type", "playlist")
            .order("created_at", { ascending: false })
            .limit(5);

        if (likesError) throw likesError;
        if (!recentLikes || recentLikes.length === 0) {
            return NextResponse.json([]);
        }

        // Extract playlist IDs from the likes
        const playlistIds = recentLikes.map(like => like.target_id);

        // Fetch playlist details from both Supabase and Spotify
        const enrichedPlaylists = await Promise.all(
            playlistIds.map(async (id) => {
                try {
                    // First try to get from our database
                    const { data: dbPlaylist, error } = await supabase
                        .from("spotify_items")
                        .select("*")
                        .eq("id", id)
                        .eq("type", "playlist")
                        .single();

                    // If we have complete data in DB, use that
                    if (dbPlaylist?.name && dbPlaylist?.cover_url) {
                        const like = recentLikes.find(l => l.target_id === id);
                        return {
                            ...dbPlaylist,
                            liked_at: like?.created_at
                        };
                    }

                    // Otherwise fetch from Spotify
                    const spotifyPlaylist = await getPlaylistDetails(id);
                    const like = recentLikes.find(l => l.target_id === id);

                    return {
                        id: spotifyPlaylist.id,
                        type: "playlist",
                        name: spotifyPlaylist.name,
                        description: spotifyPlaylist.description || "",
                        cover_url: spotifyPlaylist.images?.[0]?.url || null,
                        spotify_url: spotifyPlaylist.external_urls?.spotify || null,
                        creator: spotifyPlaylist.owner.display_name || "Pasha", // Fixed here
                        tracks: spotifyPlaylist.tracks?.total || 0,
                        like_count: dbPlaylist?.like_count || 0,
                        liked_at: like?.created_at
                    };
                } catch (error) {
                    console.error(`Failed to fetch playlist ${id}:`, error);
                    return null;
                }
            })
        );

        // Filter out failed fetches and sort by most recent like
        const validPlaylists = enrichedPlaylists.filter(Boolean);
        validPlaylists.sort((a, b) => 
            new Date(b.liked_at!).getTime() - new Date(a.liked_at!).getTime()
        );

        return NextResponse.json(validPlaylists);
    } catch (error) {
        console.error("GET recently liked playlists error:", error);
        return NextResponse.json(
            { error: "Failed to fetch recently liked playlists" },
            { status: 500 }
        );
    }
}