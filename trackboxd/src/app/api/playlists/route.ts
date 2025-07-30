// app/api/playlists/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { getCurrentUserProfile, createPlaylist, addItemsToPlaylist } from "@/lib/spotify";

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Parse request body
    const body = await req.json();
    const {
      name,
      description = "",
      isPublic = true,
      isCollaborative = false,
      trackUris = []
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Playlist name is required" },
        { status: 400 }
      );
    }

    console.log(trackUris, "tracks to add");

    // Get current user's Spotify ID
    const userProfile = await getCurrentUserProfile();
    const spotifyUserId = userProfile.id;

    // Add Trackboxd signature to description
    const trackboxdSignature = "\n\nCreated with Trackboxd";
    const fullDescription = description 
      ? `${description}${trackboxdSignature}`
      : trackboxdSignature.trim();

    // Create the playlist with the updated description
    const newPlaylist = await createPlaylist(spotifyUserId, name, {
      public: isPublic,
      collaborative: isCollaborative,
      description: fullDescription
    });

    // Add tracks if any were provided
    let snapshotId = null;
    if (trackUris.length > 0) {
      // Spotify API only allows adding 100 tracks at a time
      const batchSize = 100;
      for (let i = 0; i < trackUris.length; i += batchSize) {
        const batch = trackUris.slice(i, i + batchSize);
        console.log(`Adding batch of ${batch.length} tracks to playlist ${newPlaylist.id}`);
        snapshotId = await addItemsToPlaylist(newPlaylist.id, batch);
      }
    }

    // Store in our database (optional)
    const { error: dbError } = await supabase
      .from("spotify_items")
      .insert({
        id: newPlaylist.id,
        type: "playlist",
        name: newPlaylist.name,
        description: newPlaylist.description,
        cover_url: newPlaylist.images?.[0]?.url || null,
        artist: newPlaylist.owner.display_name,
        spotify_url: newPlaylist.external_urls.spotify,
        like_count: 0 // Initial like count
      });

    if (dbError) {
      console.error("Failed to save playlist to database:", dbError);
      // Continue even if DB save fails since Spotify creation succeeded
    }

    return NextResponse.json({
      success: true,
      playlist: {
        ...newPlaylist,
        snapshot_id: snapshotId,
        tracks_added: trackUris.length
      }
    });

  } catch (error: unknown) {
    console.error("Create playlist error:", error);
    let errorMessage = "Failed to create playlist";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}