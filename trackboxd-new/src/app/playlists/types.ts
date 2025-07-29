// types/playlist.ts
export interface Playlist {
    id: string;
    name: string; // Changed from title
    creator: string;
    cover_url: string; // Changed from coverArt
    tracks: number;
    like_count: number; // Changed from likeCount
    description: string;
}
