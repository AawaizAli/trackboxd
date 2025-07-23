import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { Database } from '../../types/supabase'; // Assuming you have types

// Type for like target types
type LikeTargetType = 'track' | 'album' | 'playlist' | 'review' | 'annotation';

/**
 * Like a track and update counts
 * @param userId - User ID from Spotify
 * @param trackId - Spotify track ID
 * @returns Success status and message
 */
export async function likeTrack(
  userId: string,
  trackId: string
): Promise<{ success: boolean; message: string }> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    // Start transaction
    const { error: txError } = await supabase.rpc('begin');
    if (txError) throw txError;

    // 1. Ensure track exists in spotify_items
    const { error: upsertError } = await supabase
      .from('spotify_items')
      .upsert(
        { id: trackId, type: 'track' },
        { onConflict: 'id', ignoreDuplicates: true }
      );

    if (upsertError) throw upsertError;

    // 2. Add like to likes table
    const { error: likeError } = await supabase.from('likes').insert({
      user_id: userId,
      target_type: 'track',
      target_id: trackId,
    });

    if (likeError) {
      if (likeError.code === '23505') {
        return { success: false, message: 'You already liked this track' };
      }
      throw likeError;
    }

    // 3. Update like_count in spotify_items
    const { error: countError } = await supabase.rpc('increment_like_count', {
      item_id: trackId,
    });

    if (countError) throw countError;

    // Commit transaction
    const { error: commitError } = await supabase.rpc('commit');
    if (commitError) throw commitError;

    return { success: true, message: 'Track liked successfully' };
  } catch (error: any) {
    // Rollback on error
    await supabase.rpc('rollback');
    console.error('Error liking track:', error);
    return { success: false, message: error.message || 'Failed to like track' };
  }
}

/**
 * Unlike a track
 * @param userId - User ID from Spotify
 * @param trackId - Spotify track ID
 * @returns Success status and message
 */
export async function unlikeTrack(
  userId: string,
  trackId: string
): Promise<{ success: boolean; message: string }> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { error, count } = await supabase
      .from('likes')
      .delete()
      .match({
        user_id: userId,
        target_type: 'track',
        target_id: trackId,
      });

    if (error) throw error;
    if (count === 0) {
      return { success: false, message: 'Like not found' };
    }

    // Decrement like count
    const { error: countError } = await supabase.rpc('decrement_like_count', {
      item_id: trackId,
    });

    if (countError) throw countError;

    return { success: true, message: 'Track unliked successfully' };
  } catch (error: any) {
    console.error('Error unliking track:', error);
    return { success: false, message: error.message || 'Failed to unlike track' };
  }
}

/**
 * Check if a user has liked a track
 * @param userId - User ID from Spotify
 * @param trackId - Spotify track ID
 * @returns Boolean indicating like status
 */
export async function isTrackLiked(
  userId: string,
  trackId: string
): Promise<boolean> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .match({
      user_id: userId,
      target_type: 'track',
      target_id: trackId,
    })
    .single();

  return !!data && !error;
}

/**
 * Like any entity (generic function)
 * @param userId - User ID from Spotify
 * @param targetType - Type of entity to like
 * @param targetId - ID of the entity
 * @returns Success status and message
 */
export async function likeEntity(
  userId: string,
  targetType: LikeTargetType,
  targetId: string
): Promise<{ success: boolean; message: string }> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    // Add like to likes table
    const { error } = await supabase.from('likes').insert({
      user_id: userId,
      target_type: targetType,
      target_id: targetId,
    });

    if (error) {
      if (error.code === '23505') {
        return { success: false, message: 'You already liked this item' };
      }
      throw error;
    }

    return { success: true, message: 'Item liked successfully' };
  } catch (error: any) {
    console.error('Error liking item:', error);
    return { success: false, message: error.message || 'Failed to like item' };
  }
}