// app/api/annotation/[song_id]/route.ts
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { song_id: string } }
) {
  const songId = params.song_id;

  if (!songId) {
    return NextResponse.json(
      { error: "Song ID is required" },
      { status: 400 }
    );
  }

  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Query to get all public annotations for the song, sorted by newest first
    const { data: annotations, error } = await supabase
      .from('annotations')
      .select(`
        id,
        timestamp,
        text,
        created_at,
        like_count,
        is_public,
        users:user_id (
          id,
          name,
          image_url
        ),
        track:track_id (
          id,
          name,
          artists:artists(name)
        )
      `)
      .eq('track_id', songId)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(annotations);

  } catch (error) {
    console.error('Error fetching annotations:', error);
    return NextResponse.json(
      { error: "Failed to fetch annotations" },
      { status: 500 }
    );
  }
}