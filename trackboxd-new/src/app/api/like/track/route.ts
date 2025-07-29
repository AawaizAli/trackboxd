import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  return handleLikeRequest(req, 'POST');
}

export async function DELETE(req: NextRequest) {
  return handleLikeRequest(req, 'DELETE');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const trackId = searchParams.get('trackId');

  if (!userId || !trackId) {
    return NextResponse.json(
      { error: 'Missing parameters' },
      { status: 400 }
    );
  }

  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    const { data } = await supabase
      .from('likes')
      .select('id')
      .match({ user_id: userId, target_type: 'track', target_id: trackId })
      .single();

    return NextResponse.json({ isLiked: !!data });
  } catch (error) {
    console.error('GET like error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleLikeRequest(req: NextRequest, method: 'POST' | 'DELETE') {
  const { userId, trackId } = await req.json();

  if (!userId || !trackId) {
    return NextResponse.json(
      { error: 'Missing parameters' },
      { status: 400 }
    );
  }

  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    if (method === 'POST') {
      // Like track logic
      const { error: upsertError } = await supabase
        .from('spotify_items')
        .upsert(
          { id: trackId, type: 'track' },
          { onConflict: 'id' }
        );

      if (upsertError) throw upsertError;

      const { error: likeError } = await supabase
        .from('likes')
        .insert({ user_id: userId, target_type: 'track', target_id: trackId });

      if (likeError) {
        if (likeError.code === '23505') {
          return NextResponse.json(
            { error: 'You already liked this track' },
            { status: 400 }
          );
        }
        throw likeError;
      }

      await supabase.rpc('increment_like_count', { item_id: trackId });
      return NextResponse.json({ success: true });
    } 
    else { // DELETE
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .match({ user_id: userId, target_type: 'track', target_id: trackId });

      if (deleteError) throw deleteError;
      
      await supabase.rpc('decrement_like_count', { item_id: trackId });
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Like API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}