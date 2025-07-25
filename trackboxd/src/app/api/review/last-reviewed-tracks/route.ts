import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { getTrackDetails } from "@/lib/spotify";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    try {
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        // Get the last 4 track reviews, ordered by creation date
        const { data: reviews, error } = await supabase
            .from("reviews")
            .select(`
                id,
                rating,
                text,
                created_at,
                user_id,
                item_id,
                spotify_items:item_id(type, id),
                users:user_id(id, name, image_url)
            `)
            .eq("spotify_items.type", "track")  // Only get track reviews
            .order("created_at", { ascending: false })
            .limit(4);

        if (error) throw error;

        // If a userId is provided, filter to only that user's reviews
        const filteredReviews = userId 
            ? reviews.filter(review => review.user_id === userId)
            : reviews;

        // Fetch additional track details from Spotify for each review
        const reviewsWithTrackDetails = await Promise.all(
            filteredReviews.map(async (review) => {
                try {
                    const trackDetails = await getTrackDetails(review.item_id);
                    return {
                        ...review,
                        track_details: trackDetails
                    };
                } catch (error) {
                    console.error(`Failed to fetch details for track ${review.item_id}:`, error);
                    return review; // Return review without track details if fetch fails
                }
            })
        );

        return NextResponse.json(reviewsWithTrackDetails.slice(0, 4));  // Ensure we only return 4
    } catch (error) {
        console.error("GET last reviews error:", error);
        return NextResponse.json(
            { error: "Failed to fetch recent reviews" },
            { status: 500 }
        );
    }
}