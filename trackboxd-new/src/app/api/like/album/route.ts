import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  return handleAlbumLikeRequest(req, 'POST');
}

export async function DELETE(req: NextRequest) {
  return handleAlbumLikeRequest(req, 'DELETE');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const albumId = searchParams.get('albumId');

  if (!userId || !albumId) {
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
        target_type: 'album',  // Changed to album
        target_id: albumId     // Changed to albumId
      })
      .single();

    return NextResponse.json({ isLiked: !!data });
  } catch (error) {
    console.error('GET album like error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleAlbumLikeRequest(req: NextRequest, method: 'POST' | 'DELETE') {
  const { userId, albumId } = await req.json();  // Changed to albumId
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  if (!userId || !albumId) {
    return NextResponse.json(
      { error: 'Missing parameters' },
      { status: 400 }
    );
  }

  try {
    // Start transaction
    await supabase.rpc('begin');

    // Ensure album exists in spotify_items
    const { data: itemExists, error: itemError } = await supabase
      .from('spotify_items')
      .select('id')
      .eq('id', albumId)  // Changed to albumId
      .single();

    if (itemError || !itemExists) {
      // Create entry if it doesn't exist
      const { error: createError } = await supabase
        .from('spotify_items')
        .insert({
          id: albumId,  // Changed to albumId
          type: 'album', // Changed to album
          like_count: 0,
          review_count: 0,
          annotation_count: 0,
          avg_rating: 0.00
        });

      if (createError) {
        console.error('Error creating spotify item:', createError);
        await supabase.rpc('rollback');
        return NextResponse.json(
          { error: 'Failed to initialize album data' },  // Updated message
          { status: 500 }
        );
      }
    }

    if (method === 'POST') {
      // Like album logic
      const { error: likeError } = await supabase
        .from('likes')
        .insert({ 
          user_id: userId, 
          target_type: 'album',  // Changed to album
          target_id: albumId      // Changed to albumId
        });

      if (likeError) {
        if (likeError.code === '23505') {
          await supabase.rpc('rollback');
          return NextResponse.json(
            { error: 'You already liked this album' },  // Updated message
            { status: 400 }
          );
        }
        throw likeError;
      }

      // Update album's like count
      const { error: countError } = await supabase.rpc('increment_spotify_item_like_count', { 
        item_id: albumId  // Changed to albumId
      });
      if (countError) throw countError;

      await supabase.rpc('commit');
      return NextResponse.json({ success: true });
    } 
    else { // DELETE
      // Unlike album logic
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .match({ 
          user_id: userId, 
          target_type: 'album',  // Changed to album
          target_id: albumId     // Changed to albumId
        });

      if (deleteError) throw deleteError;
      
      // Update album's like count
      const { error: countError } = await supabase.rpc('decrement_spotify_item_like_count', { 
        item_id: albumId  // Changed to albumId
      });
      if (countError) throw countError;

      await supabase.rpc('commit');
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    await supabase.rpc('rollback');
    console.error('Album like API error:', error);  // Updated log
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}