import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> }
) {
  if (!params || !params.song_id) {
    return NextResponse.json(
      { error: "Song ID is required" },
      { status: 400 }
    );
  }

  const songId = Array.isArray(params.song_id) 
    ? params.song_id[0] 
    : params.song_id;

  if (!songId) {
    return NextResponse.json(
      { error: "Song ID is required" },
      { status: 400 }
    );
  }

  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

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