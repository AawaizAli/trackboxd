import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { getAlbumDetails } from "@/lib/spotify";

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

interface ReviewGroup {
    item_id: string;
    max_created_at: string;
}

export async function GET(req: NextRequest) {
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        // Get distinct album IDs with their most recent review timestamp
        const { data: recentReviews, error: reviewsError } = await supabase
            .from("reviews")
            .select(`
                item_id, 
                created_at,
                spotify_items!inner (type)
            `)
            .eq("spotify_items.type", "album") // Only albums
            .order("created_at", { ascending: false });

        if (reviewsError) throw reviewsError;
        if (!recentReviews || recentReviews.length === 0) {
            return NextResponse.json([]);
        }

        // Group by item_id and get most recent timestamp
        const groupedReviews = recentReviews.reduce(
            (acc: Record<string, ReviewGroup>, review) => {
                if (
                    !acc[review.item_id] ||
                    new Date(acc[review.item_id].max_created_at) <
                        new Date(review.created_at)
                ) {
                    acc[review.item_id] = {
                        item_id: review.item_id,
                        max_created_at: review.created_at,
                    };
                }
                return acc;
            },
            {}
        );

        // Sort by most recent and get top 5
        const sortedReviews = Object.values(groupedReviews)
            .sort(
                (a, b) =>
                    new Date(b.max_created_at).getTime() -
                    new Date(a.max_created_at).getTime()
            )
            .slice(0, 5);

        const albumIds = sortedReviews.map((review) => review.item_id);

        // Fetch album details, review counts, and ratings
        const enrichedAlbums = await Promise.all(
            albumIds.map(async (id) => {
                try {
                    // 1. Get album metadata from our database
                    const { data: dbAlbum, error: dbError } = await supabase
                        .from("spotify_items")
                        .select("like_count")
                        .eq("id", id)
                        .single();

                    if (dbError) throw dbError;

                    // 2. Get review stats
                    const { data: reviewStats, error: statsError } =
                        await supabase
                            .from("reviews")
                            .select("rating", { count: "exact" })
                            .eq("item_id", id);

                    if (statsError) throw statsError;

                    // 3. Fetch Spotify metadata
                    const spotifyAlbum = await getAlbumDetails(id);
                    
                    if (!spotifyAlbum) {
                        console.warn(`Album not found: ${id}`);
                        return null;
                    }

                    // 4. Get the last review timestamp
                    const reviewData = sortedReviews.find(
                        (r) => r.item_id === id
                    );

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
                        review_count: reviewStats?.length || 0,
                        last_reviewed_at: reviewData?.max_created_at,
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
        console.error("GET recently reviewed albums error:", error);
        return NextResponse.json(
            { error: "Failed to fetch recently reviewed albums" },
            { status: 500 }
        );
    }
}