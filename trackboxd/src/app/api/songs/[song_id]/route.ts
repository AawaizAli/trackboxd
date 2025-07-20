import { getTrackDetails } from "@/lib/spotify";
import { NextResponse } from "next/server";

// Workaround for Next.js 13 App Router limitation
export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { song_id: string } }
) {
  try {
    const param = await params;
    // Access params directly without destructuring
    const trackId = param.song_id;

    if (!trackId) {
        return NextResponse.json(
          { error: "Track ID is required" },
          { status: 400 }
        );
      }
  
      const trackDetails = await getTrackDetails(trackId);
      
      // Return the response directly
      return NextResponse.json(trackDetails);
    } catch (error) {
      console.error("Failed to fetch track details:", error);
      
      if (error instanceof Error) {
        return NextResponse.json(
          { 
            error: "Failed to fetch track details",
            details: error.message
          },
          { status: 500 }
        );
      }
  
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }