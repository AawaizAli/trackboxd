import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Fetches statistics for a Spotify item directly from Supabase
 * @param id - Spotify item ID
 * @returns Promise with statistics from spotify_items table
 */
export const getSpotifyItemStats = async (id: string): Promise<{
  id: string;
  type: 'track' | 'album' | 'playlist';
  like_count: number;
  review_count: number;
  annotation_count: number;
  avg_rating: number;
  last_updated: string;
}> => {
  try {
    const { data, error } = await supabase
      .from('spotify_items')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) {
      // Return default values if no record exists
      return {
        id,
        type: 'track',
        like_count: 0,
        review_count: 0,
        annotation_count: 0,
        avg_rating: 0,
        last_updated: new Date().toISOString()
      };
    }

    return {
      id: data.id,
      type: data.type as 'track' | 'album' | 'playlist',
      like_count: data.like_count || 0,
      review_count: data.review_count || 0,
      annotation_count: data.annotation_count || 0,
      avg_rating: data.avg_rating || 0,
      last_updated: data.last_updated || new Date().toISOString()
    };

  } catch (error) {
    console.error(`Supabase error fetching stats for ${id}:`, error);
    // Return defaults on error
    return {
      id,
      type: 'track',
      like_count: 0,
      review_count: 0,
      annotation_count: 0,
      avg_rating: 0,
      last_updated: new Date().toISOString()
    };
  }
};