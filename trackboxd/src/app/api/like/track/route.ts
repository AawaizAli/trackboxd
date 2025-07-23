import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, trackId } = req.body;

  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    if (req.method === 'POST') {
      // Like track logic
      const { error: upsertError } = await supabase
        .from('spotify_items')
        .upsert({ id: trackId, type: 'track' }, { onConflict: 'id' });

      if (upsertError) throw upsertError;

      const { error: likeError } = await supabase
        .from('likes')
        .insert({ user_id: userId, target_type: 'track', target_id: trackId });

      if (likeError) {
        if (likeError.code === '23505') {
          return res.status(400).json({ error: 'You already liked this track' });
        }
        throw likeError;
      }

      await supabase.rpc('increment_like_count', { item_id: trackId });
      return res.status(200).json({ success: true });
    } 
    else if (req.method === 'DELETE') {
      // Unlike track logic
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .match({ user_id: userId, target_type: 'track', target_id: trackId });

      if (deleteError) throw deleteError;
      
      await supabase.rpc('decrement_like_count', { item_id: trackId });
      return res.status(200).json({ success: true });
    } 
    else if (req.method === 'GET') {
      // Check like status
      const { data } = await supabase
        .from('likes')
        .select('id')
        .match({ user_id: userId, target_type: 'track', target_id: trackId })
        .single();

      return res.status(200).json({ isLiked: !!data });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).end('Method Not Allowed');
  } catch (error) {
    console.error('Like API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}