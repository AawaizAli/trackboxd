import React from "react";
import Link from "next/link";
import { Music, Album, Clock } from "lucide-react";

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

interface ActivityItemProps {
  activity: ActivityItem;
  isLast?: boolean;
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (secondsAgo < 60) {
    return secondsAgo === 1 ? '1 second ago' : `${secondsAgo} seconds ago`;
  }
  
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return minutesAgo === 1 ? '1 minute ago' : `${minutesAgo} minutes ago`;
  }
  
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return hoursAgo === 1 ? '1 hour ago' : `${hoursAgo} hours ago`;
  }
  
  const daysAgo = Math.floor(hoursAgo / 24);
  return daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const ActivityItem = ({ activity, isLast = false }: ActivityItemProps) => {
  const timeAgo = formatTimeAgo(activity.created_at);

  const renderContent = () => {
    switch (activity.type) {
      case "review":
        return (
          <>
            <div className="flex items-center gap-2 mb-1">
              <img 
                src={activity.user.image_url} 
                alt={activity.user.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-[#A0A0A0]">
                {activity.user.name} reviewed
              </span>
              <Music className="w-4 h-4 text-[#FFBA00]" />
            </div>
            <div className="mb-2 flex items-start gap-3">
              {activity.cover_url ? (
                <img 
                  src={activity.cover_url} 
                  alt={activity.title}
                  className="w-12 h-12 rounded-md"
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 flex items-center justify-center">
                  <Music className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div>
                <h4 className="font-medium text-[#1F2C24]">
                  {activity.title}
                </h4>
                <p className="text-sm text-[#A0A0A0]">
                  by {activity.artist}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} className="relative">
                  <div className="w-4 h-4 text-[#D9D9D9]">★</div>
                  <div
                    className="absolute top-0 left-0 w-5 h-5 text-[#FFBA00] overflow-hidden"
                    style={{
                      width: `${Math.max(0, Math.min(1, (activity.rating || 0) - star + 1)) * 100}%`,
                    }}>
                    ★
                  </div>
                </div>
              ))}
              <span className="text-sm text-[#1F2C24] ml-1">{activity.rating}</span>
            </div>
            {activity.content && (
              <p className="text-sm text-[#1F2C24] mt-2 line-clamp-2">
                {activity.content}
              </p>
            )}
          </>
        );
      case "annotation":
        return (
          <>
            <div className="flex items-center gap-2 mb-1">
              <img 
                src={activity.user.image_url} 
                alt={activity.user.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-[#A0A0A0]">
                {activity.user.name} annotated
              </span>
              <Clock className="w-4 h-4 text-[#FFBA00]" />
            </div>
            <div className="mb-2 flex items-start gap-3">
              {activity.cover_url ? (
                <img 
                  src={activity.cover_url} 
                  alt={activity.track}
                  className="w-12 h-12 rounded-md"
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 flex items-center justify-center">
                  <Music className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div>
                <h4 className="font-medium text-[#1F2C24]">
                  {activity.track}
                </h4>
                <p className="text-sm text-[#A0A0A0]">
                  by {activity.artist} {activity.timestamp !== undefined && 
                    `· at ${formatDuration(activity.timestamp)}`}
                </p>
              </div>
            </div>
            {activity.content && (
              <p className="text-sm text-[#1F2C24] mb-2">
                {activity.content}
              </p>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative pl-3">
      {/* Timeline line */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#D9D9D9]"
        style={{ height: isLast ? "2.5rem" : "100%" }}
      />
      {/* Timeline dot */}
      <div className="absolute left-0 top-0 transform -translate-x-2/5 w-3 h-3 rounded-full bg-[#FFBA00] border-2 border-[#F9F9F6]" />

      <div className="p-4 space-y-1">
        {renderContent()}
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#A0A0A0]">
            {timeAgo}
          </span>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-sm text-[#A0A0A0] hover:text-[#6D9773]">
              <span className="text-xs">❤️</span>
              0
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;