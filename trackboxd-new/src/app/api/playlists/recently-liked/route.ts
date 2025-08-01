import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { getPlaylistDetails } from "@/lib/spotify";

interface LikeGroup {
  target_id: string;
  max_created_at: string;
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Get distinct playlist IDs with their most recent like timestamp
    const { data: recentLikes, error: likesError } = await supabase
      .from("likes")
      .select("target_id, created_at")
      .eq("target_type", "playlist")
      .order("created_at", { ascending: false });

    if (likesError) throw likesError;
    if (!recentLikes || recentLikes.length === 0) {
      return NextResponse.json([]);
    }

    // Group by target_id and get most recent timestamp
    const groupedLikes = recentLikes.reduce((acc: Record<string, LikeGroup>, like) => {
      if (!acc[like.target_id] || new Date(acc[like.target_id].max_created_at) < new Date(like.created_at)) {
        acc[like.target_id] = {
          target_id: like.target_id,
          max_created_at: like.created_at
        };
      }
      return acc;
    }, {});

    // Sort by most recent and get top 5
    const sortedLikes = Object.values(groupedLikes)
      .sort((a, b) => 
        new Date(b.max_created_at).getTime() - new Date(a.max_created_at).getTime()
      )
      .slice(0, 5);

    const playlistIds = sortedLikes.map(like => like.target_id);

    // Fetch playlist details and like counts
    const enrichedPlaylists = await Promise.all(
      playlistIds.map(async (id) => {
        try {
          // 1. Get our internal like count from spotify_items
          const { data: dbPlaylist, error } = await supabase
            .from("spotify_items")
            .select("like_count")
            .eq("id", id)
            .single();

          // 2. Fetch Spotify metadata
          const spotifyPlaylist = await getPlaylistDetails(id);
          
          // 3. Get the last like timestamp
          const likeData = sortedLikes.find(l => l.target_id === id);
          
          return {
            id: spotifyPlaylist.id,
            name: spotifyPlaylist.name,
            description: spotifyPlaylist.description || "",
            cover_url: spotifyPlaylist.images?.[0]?.url || null,
            creator: spotifyPlaylist.owner?.display_name || "Unknown",
            tracks: spotifyPlaylist.tracks?.total || 0,
            like_count: dbPlaylist?.like_count || 0,  // Use our internal count
            last_liked_at: likeData?.max_created_at
          };
        } catch (error) {
          console.error(`Failed to fetch playlist ${id}:`, error);
          return null;
        }
      })
    );

    // Filter out failed fetches
    const validPlaylists = enrichedPlaylists.filter(Boolean);

    return NextResponse.json(validPlaylists);
  } catch (error) {
    console.error("GET recently liked playlists error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recently liked playlists" },
      { status: 500 }
    );
  }
}