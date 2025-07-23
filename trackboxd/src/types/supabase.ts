export type Database = {
    public: {
      Tables: {
        users: {
          Row: {
            id: string;
            email: string;
            name: string | null;
            image_url: string | null;
            country: string | null;
            spotify_url: string | null;
            created_at: string;
          };
          Insert: {
            id: string;
            email: string;
            name?: string | null;
            image_url?: string | null;
            country?: string | null;
            spotify_url?: string | null;
            created_at?: string;
          };
          Update: {
            id?: string;
            email?: string;
            name?: string | null;
            image_url?: string | null;
            country?: string | null;
            spotify_url?: string | null;
            created_at?: string;
          };
        };
        spotify_items: {
          Row: {
            id: string;
            type: 'track' | 'album' | 'playlist';
            like_count: number;
            review_count: number;
            annotation_count: number;
            avg_rating: number;
            last_updated: string;
          };
          Insert: {
            id: string;
            type: 'track' | 'album' | 'playlist';
            like_count?: number;
            review_count?: number;
            annotation_count?: number;
            avg_rating?: number;
            last_updated?: string;
          };
          Update: {
            id?: string;
            type?: 'track' | 'album' | 'playlist';
            like_count?: number;
            review_count?: number;
            annotation_count?: number;
            avg_rating?: number;
            last_updated?: string;
          };
        };
        reviews: {
          Row: {
            id: string;
            user_id: string;
            item_id: string;
            rating: number;
            text: string | null;
            is_public: boolean;
            like_count: number;
            created_at: string;
          };
          Insert: {
            id?: string;
            user_id: string;
            item_id: string;
            rating: number;
            text?: string | null;
            is_public?: boolean;
            like_count?: number;
            created_at?: string;
          };
          Update: {
            id?: string;
            user_id?: string;
            item_id?: string;
            rating?: number;
            text?: string | null;
            is_public?: boolean;
            like_count?: number;
            created_at?: string;
          };
        };
        annotations: {
          Row: {
            id: string;
            user_id: string;
            track_id: string;
            timestamp: number;
            text: string;
            is_public: boolean;
            like_count: number;
            created_at: string;
          };
          Insert: {
            id?: string;
            user_id: string;
            track_id: string;
            timestamp: number;
            text: string;
            is_public?: boolean;
            like_count?: number;
            created_at?: string;
          };
          Update: {
            id?: string;
            user_id?: string;
            track_id?: string;
            timestamp?: number;
            text?: string;
            is_public?: boolean;
            like_count?: number;
            created_at?: string;
          };
        };
        likes: {
          Row: {
            id: string;
            user_id: string;
            target_type: 'track' | 'album' | 'playlist' | 'review' | 'annotation';
            target_id: string;
            created_at: string;
          };
          Insert: {
            id?: string;
            user_id: string;
            target_type: 'track' | 'album' | 'playlist' | 'review' | 'annotation';
            target_id: string;
            created_at?: string;
          };
          Update: {
            id?: string;
            user_id?: string;
            target_type?: 'track' | 'album' | 'playlist' | 'review' | 'annotation';
            target_id?: string;
            created_at?: string;
          };
        };
        playlists: {
          Row: {
            id: string;
            user_id: string;
            name: string;
            description: string | null;
            is_public: boolean;
            created_at: string;
          };
          Insert: {
            id: string;
            user_id: string;
            name: string;
            description?: string | null;
            is_public?: boolean;
            created_at?: string;
          };
          Update: {
            id?: string;
            user_id?: string;
            name?: string;
            description?: string | null;
            is_public?: boolean;
            created_at?: string;
          };
        };
        activity: {
          Row: {
            id: string;
            user_id: string;
            action: string;
            target_type: string;
            target_id: string;
            timestamp: string;
          };
          Insert: {
            id?: string;
            user_id: string;
            action: string;
            target_type: string;
            target_id: string;
            timestamp?: string;
          };
          Update: {
            id?: string;
            user_id?: string;
            action?: string;
            target_type?: string;
            target_id?: string;
            timestamp?: string;
          };
        };
        tags: {
          Row: {
            id: string;
            name: string;
          };
          Insert: {
            id?: string;
            name: string;
          };
          Update: {
            id?: string;
            name?: string;
          };
        };
        review_tags: {
          Row: {
            review_id: string;
            tag_id: string;
          };
          Insert: {
            review_id: string;
            tag_id: string;
          };
          Update: {
            review_id?: string;
            tag_id?: string;
          };
        };
        follows: {
          Row: {
            follower_id: string;
            following_id: string;
            created_at: string;
          };
          Insert: {
            follower_id: string;
            following_id: string;
            created_at?: string;
          };
          Update: {
            follower_id?: string;
            following_id?: string;
            created_at?: string;
          };
        };
      };
      Views: {
        // You can add view definitions here if you have any
      };
      Functions: {
        increment_like_count: {
          Args: {
            item_id: string;
          };
          Returns: void;
        };
        decrement_like_count: {
          Args: {
            item_id: string;
          };
          Returns: void;
        };
        // Add other functions here
      };
      Enums: {
        // Add any custom enums here
      };
    };
  };
  
  // Helper types for common operations
  export type Tables = Database['public']['Tables'];
  export type TableName = keyof Tables;
  
  export type User = Tables['users']['Row'];
  export type SpotifyItem = Tables['spotify_items']['Row'];
  export type Review = Tables['reviews']['Row'];
  export type Annotation = Tables['annotations']['Row'];
  export type Like = Tables['likes']['Row'];
  export type Playlist = Tables['playlists']['Row'];
  export type Activity = Tables['activity']['Row'];
  export type Tag = Tables['tags']['Row'];
  export type Follow = Tables['follows']['Row'];
  
  // Type for like target types
  export type LikeTargetType = 'track' | 'album' | 'playlist' | 'review' | 'annotation';
  
  // Type for spotify item types
  export type SpotifyItemType = 'track' | 'album' | 'playlist';
  
  // Type for inserting a new like
  export type InsertLike = {
    user_id: string;
    target_type: LikeTargetType;
    target_id: string;
  };
  
  // Type for checking if an item is liked
  export type LikeStatus = {
    isLiked: boolean;
    likeId?: string;
  };
  
  // Type for paginated results
  export type PaginatedResult<T> = {
    data: T[];
    count: number;
    page: number;
    perPage: number;
    totalPages: number;
  };