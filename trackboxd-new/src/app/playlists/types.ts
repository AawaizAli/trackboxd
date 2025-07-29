// types/playlist.ts
export interface Playlist {
    id: string;
    name: string;
    creator: string;
    cover_url: string;
    tracks: number;
    like_count: number;
    description: string;
    isLiked?: boolean; // Add this optional property
    liked_at?: string; // Already in your component
    weekly_likes?: number; // Already in your component
}