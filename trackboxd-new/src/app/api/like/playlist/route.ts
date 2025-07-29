import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  return handlePlaylistLikeRequest(req, 'POST');
}

export async function DELETE(req: NextRequest) {
  return handlePlaylistLikeRequest(req, 'DELETE');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const playlistId = searchParams.get('playlistId');

  if (!userId || !playlistId) {
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
      .match({ 
        user_id: userId, 
        target_type: 'playlist', 
        target_id: playlistId 
      })
      .single();

    return NextResponse.json({ isLiked: !!data });
  } catch (error) {
    console.error('GET playlist like error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handlePlaylistLikeRequest(req: NextRequest, method: 'POST' | 'DELETE') {
  const { userId, playlistId } = await req.json();
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (!userId || !playlistId) {
    return NextResponse.json(
      { error: 'Missing parameters' },
      { status: 400 }
    );
  }

  try {
    // Start transaction
    await supabase.rpc('begin');

    // Ensure playlist exists in spotify_items
    const { data: itemExists, error: itemError } = await supabase
      .from('spotify_items')
      .select('id')
      .eq('id', playlistId)
      .single();

    if (itemError || !itemExists) {
      // Create entry if it doesn't exist
      const { error: createError } = await supabase
        .from('spotify_items')
        .insert({
          id: playlistId,
          type: 'playlist',
          like_count: 0,
          review_count: 0,
          annotation_count: 0,
          avg_rating: 0.00
        });

      if (createError) {
        console.error('Error creating spotify item:', createError);
        await supabase.rpc('rollback');
        return NextResponse.json(
          { error: 'Failed to initialize playlist data' },
          { status: 500 }
        );
      }
    }

    if (method === 'POST') {
      // Like playlist logic
      const { error: likeError } = await supabase
        .from('likes')
        .insert({ 
          user_id: userId, 
          target_type: 'playlist', 
          target_id: playlistId 
        });

      if (likeError) {
        if (likeError.code === '23505') {
          await supabase.rpc('rollback');
          return NextResponse.json(
            { error: 'You already liked this playlist' },
            { status: 400 }
          );
        }
        throw likeError;
      }

      // Update playlist's like count
      const { error: countError } = await supabase.rpc('increment_spotify_item_like_count', { 
        item_id: playlistId 
      });
      if (countError) throw countError;

      await supabase.rpc('commit');
      return NextResponse.json({ success: true });
    } 
    else { // DELETE
      // Unlike playlist logic
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .match({ 
          user_id: userId, 
          target_type: 'playlist', 
          target_id: playlistId 
        });

      if (deleteError) throw deleteError;
      
      // Update playlist's like count
      const { error: countError } = await supabase.rpc('decrement_spotify_item_like_count', { 
        item_id: playlistId 
      });
      if (countError) throw countError;

      await supabase.rpc('commit');
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    await supabase.rpc('rollback');
    console.error('Playlist like API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}