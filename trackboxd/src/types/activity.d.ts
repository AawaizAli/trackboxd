// types/activity.d.ts
export interface ActivityItem {
  id: string;
  user: {
    id: string;
    name: string;
    image_url: string;
  };
  created_at: string;
  type: "review" | "annotation";
  title?: string;
  artist?: string;
  rating?: number;
  content?: string;
  track?: string;
  timestamp?: number;
  cover_url?: string;
  spotify_url?: string;
}

export interface ActivityItemProps {
  activity: ActivityItem;
  isLast?: boolean;
}