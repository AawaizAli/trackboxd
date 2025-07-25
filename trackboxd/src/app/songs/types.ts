export interface Track {
    id: string;
    title: string;
    artist: string;
    album: string;
    coverArt: string;
    avgRating: number;
    saveCount: number;
    genre: string;
    year: number;
    mood: string;
    isSaved: boolean;
  }
  
  export interface SpotifyTrack {
    id: string;
    name: string;
    preview_url: string | null;
    album: {
      name: string;
      images: { url: string }[];
      release_date: string;
    };
    artists: { name: string }[];
    added_by?: {
      id: string;
    };
  }
  
  export interface Review {
    id: string;
    rating: number;
    text: string;
    created_at: string;
    user_id: string;
    item_id: string;
    spotify_items: {
      id: string;
      type: string;
    };
    users: {
      id: string;
      name: string;
      image_url: string;
    };
    track_details: {
      id: string;
      name: string;
      album: {
        name: string;
        images: { url: string }[];
        release_date: string;
      };
      artists: { name: string }[];
    };
  }
  
  export interface Annotation {
    id: string;
    user: string;
    content: string;
    timestamp: string;
    likes: number;
  }
  
  export interface SpotifyPlaylistTrack {
    track: SpotifyTrack;
  }