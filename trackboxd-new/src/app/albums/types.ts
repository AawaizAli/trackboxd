export interface Album {
    id: string;
    name: string;
    creator: string;
    cover_url: string;
    like_count: number;
    tracks: number;
    release_date?: string;
    description?: string;
    review_count?: number;
    last_reviewed_at?: string;
    weekly_likes?: number;
}