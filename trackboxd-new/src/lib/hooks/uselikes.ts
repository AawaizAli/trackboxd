// lib/hooks/useLike.ts
import { useState, useEffect, useCallback } from 'react';

export function useLike(userId: string | undefined, trackId: string) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkLikeStatus = useCallback(async () => {
    if (!userId) return false;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/likes/check?userId=${userId}&trackId=${trackId}`);
      if (!response.ok) throw new Error('Failed to check like status');
      const { isLiked } = await response.json();
      return isLiked;
    } catch (error) {
      console.error('Error checking like status:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userId, trackId]);

  const toggleLike = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const method = isLiked ? 'DELETE' : 'POST';
      const endpoint = isLiked ? '/api/likes/unlike' : '/api/likes/like';

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, trackId }),
      });

      if (!response.ok) throw new Error('Failed to toggle like');
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, trackId, isLiked]);

  // Initialize like status
  useEffect(() => {
    const initializeLikeStatus = async () => {
      const liked = await checkLikeStatus();
      setIsLiked(liked);
    };
    initializeLikeStatus();
  }, [checkLikeStatus]);

  return { isLiked, isLoading, toggleLike };
}