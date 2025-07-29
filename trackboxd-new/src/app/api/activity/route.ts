import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

interface User {
  id: string;
  name: string;
  image_url: string;
}

interface SpotifyItem {
  id: string;
  cover_url: string;
  spotify_url: string;
}

interface Review {
  id: string;
  rating: number;
  text: string;
  item_id: string;
  spotify_items: SpotifyItem[]; // Changed to array
}

interface Annotation {
  id: string;
  text: string;
  timestamp: number;
  track_id: string;
  spotify_items: SpotifyItem[]; // Changed to array
}

interface Activity {
  id: string;
  user_id: string;
  action: string;
  target_table: string;
  target_id: string;
  created_at: string;
  users: User;
}

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    // Fetch activity data
    const { data: activities, error: activityError } = await supabase
      .from("activity")
      .select(`
        id,
        user_id,
        action,
        target_table,
        target_id,
        created_at,
        users:user_id (id, name, image_url)
      `)
      .order("created_at", { ascending: false })
      .limit(50);

    if (activityError) throw activityError;
    if (!activities || activities.length === 0) return NextResponse.json([]);

    // Separate review and annotation activities
    const reviewIds: string[] = [];
    const annotationIds: string[] = [];
    
    activities.forEach((activity: any) => {
      if (activity.action === "review" && activity.target_table === "review") {
        reviewIds.push(activity.target_id);
      } else if (activity.action === "annotation" && activity.target_table === "annotation") {
        annotationIds.push(activity.target_id);
      }
    });

    // Fetch reviews
    let reviewsData: Review[] = [];
    if (reviewIds.length > 0) {
      const { data: reviews, error: reviewError } = await supabase
        .from("reviews")
        .select(`
          id,
          rating,
          text,
          item_id,
          spotify_items (id, cover_url, spotify_url)
        `)
        .in("id", reviewIds);
      
      if (reviewError) throw reviewError;
      reviewsData = reviews as unknown as Review[] || [];
    }

    // Fetch annotations
    let annotationsData: Annotation[] = [];
    if (annotationIds.length > 0) {
      const { data: annotations, error: annotationError } = await supabase
        .from("annotations")
        .select(`
          id,
          text,
          timestamp,
          track_id,
          spotify_items:track_id (id, cover_url, spotify_url)
        `)
        .in("id", annotationIds);
      
      if (annotationError) throw annotationError;
      annotationsData = annotations as unknown as Annotation[] || [];
    }

    // Format activities for frontend
    const formattedActivities = activities.map((activity: any) => {
      const base = {
        id: activity.id,
        user: activity.users,
        created_at: activity.created_at,
      };

      if (activity.action === "review" && activity.target_table === "review") {
        const review = reviewsData.find(r => r.id === activity.target_id);
        if (!review) return base;
        
        // Get first spotify item (should only have one)
        const spotifyItem = review.spotify_items?.[0] || null;
        
        return {
          ...base,
          type: "review",
          title: "Track Title", // Placeholder
          artist: "Artist Name", // Placeholder
          cover_url: spotifyItem?.cover_url || "",
          spotify_url: spotifyItem?.spotify_url || "",
          rating: review.rating,
          content: review.text,
        };
      }

      if (activity.action === "annotation" && activity.target_table === "annotation") {
        const annotation = annotationsData.find(a => a.id === activity.target_id);
        if (!annotation) return base;
        
        // Get first spotify item (should only have one)
        const spotifyItem = annotation.spotify_items?.[0] || null;
        
        return {
          ...base,
          type: "annotation",
          track: "Track Title", // Placeholder
          artist: "Artist Name", // Placeholder
          cover_url: spotifyItem?.cover_url || "",
          spotify_url: spotifyItem?.spotify_url || "",
          content: annotation.text,
          timestamp: annotation.timestamp,
        };
      }

      return base;
    });

    return NextResponse.json(formattedActivities);
  } catch (error) {
    console.error("Activity fetch error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}