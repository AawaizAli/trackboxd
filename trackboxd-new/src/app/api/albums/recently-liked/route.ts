import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { getAlbumDetails } from "@/lib/spotify";

interface LikeGroup {
    target_id: string;
    max_created_at: string;
}

interface SpotifyArtist {
    name: string;
    id: string;
}

interface SpotifyAlbum {
    id: string;
    name: string;
    description?: string;
    images?: { url: string }[];
    external_urls?: {
        spotify: string;
    };
    artists?: SpotifyArtist[];
    tracks?: {
        total: number;
    };
    release_date?: string;
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Get recent album likes (limit to last 100 for efficiency)
    const { data: recentLikes, error: likesError } = await supabase
      .from("likes")
      .select(`target_id, created_at`)
      .eq("target_type", "album")
      .order("created_at", { ascending: false })
      .limit(100);

    if (likesError) throw likesError;
    if (!recentLikes || recentLikes.length === 0) {
      return NextResponse.json([]);
    }

    // Group by target_id and get most recent timestamp
    const groupedLikes = recentLikes.reduce(
      (acc: Record<string, LikeGroup>, like) => {
        if (
          !acc[like.target_id] ||
          new Date(acc[like.target_id].max_created_at) < new Date(like.created_at)
        ) {
          acc[like.target_id] = {
            target_id: like.target_id,
            max_created_at: like.created_at,
          };
        }
        return acc;
      },
      {}
    );

    // Sort by most recent and get top 5
    const sortedLikes = Object.values(groupedLikes)
      .sort(
        (a, b) =>
          new Date(b.max_created_at).getTime() - new Date(a.max_created_at).getTime()
      )
      .slice(0, 5);

    const albumIds = sortedLikes.map((like) => like.target_id);

    // Fetch album details and like counts
    const enrichedAlbums = await Promise.all(
      albumIds.map(async (id) => {
        try {
          // 1. Verify album exists in spotify_items
          const { data: dbAlbum, error } = await supabase
            .from("spotify_items")
            .select("like_count, type")
            .eq("id", id)
            .single();

          // Skip if not found or not an album
          if (error || !dbAlbum || dbAlbum.type !== "album") {
            console.warn(`Skipping invalid album: ${id}`);
            return null;
          }

          // 2. Fetch Spotify metadata
          const spotifyAlbum = await getAlbumDetails(id);
          if (!spotifyAlbum) {
            console.warn(`Album not found: ${id}`);
            return null;
          }

          // 3. Get the last like timestamp
          const likeData = sortedLikes.find((l) => l.target_id === id);

          return {
            id: spotifyAlbum.id,
            name: spotifyAlbum.name,
            description: spotifyAlbum.description || "",
            cover_url: spotifyAlbum.images?.[0]?.url || null,
            creator:
              spotifyAlbum.artists
                ?.map((a: SpotifyArtist) => a.name)
                .join(", ") || "Unknown",
            tracks: spotifyAlbum.tracks?.total || 0,
            release_date: spotifyAlbum.release_date || "",
            like_count: dbAlbum?.like_count || 0,
            last_liked_at: likeData?.max_created_at,
          };
        } catch (error) {
          console.error(`Failed to process album ${id}:`, error);
          return null;
        }
      })
    );

    // Filter out failed fetches
    const validAlbums = enrichedAlbums.filter(Boolean);

    return NextResponse.json(validAlbums);
  } catch (error) {
    console.error("GET recently liked albums error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recently liked albums" },
      { status: 500 }
    );
  }
}
