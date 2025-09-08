import React from "react";
import Link from "next/link";
import { Review } from "@/app/songs/types";
import { Star } from "lucide-react";

interface CompactReviewCardProps {
  review: Review;
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

const CompactReviewCard: React.FC<CompactReviewCardProps> = ({ review }) => {
  const timeAgo = formatTimeAgo(review.created_at);
  const trackName = review.track_details?.name || "Unknown Track";
  
  // Add max length handling for artists
  const MAX_ARTISTS = 2;
  const artists = review.track_details?.artists || [];
  const artistNames = artists.length > MAX_ARTISTS
    ? `${artists.slice(0, MAX_ARTISTS).map(a => a.name).join(", ")} + ${artists.length - MAX_ARTISTS} more`
    : artists.map(a => a.name).join(", ") || "Unknown Artist";
  
  return (
    <div className="bg-[#FFFBEb] border border-[#5C5537]/20 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
          <img 
              src={review.users.image_url || "./default-avatar.jpg"} 
              alt={review.users.name}
              className="w-6 h-6 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "./default-avatar.jpg";
              }}
            />
            <div className="font-medium text-[#5C5537]">
              {review.users.name}
            </div>
            <div className="flex items-center text-[#FFBA00] text-sm">
              <Star className="h-4 w-4 mr-0.5 inline" />
              <span>{review.rating}</span>
            </div>
          </div>
          
          <div className="mb-2">
            <h3 className="font-semibold text-[#5C5537] text-sm">{trackName}</h3>
            <p className="text-[#5C5537]/70 text-xs">{artistNames}</p>
          </div>

          {review.text && (
            <p className="text-[#5C5537] text-sm line-clamp-2 mb-2">
              {review.text}
            </p>
          )}

          <div className="flex justify-between items-center">
            <span className="text-xs text-[#5C5537]/70">
              {timeAgo}
            </span>
            <Link 
              href={`/songs/${review.item_id}`} 
              className="text-xs text-[#5C5537]/70 hover:text-[#5C5537]"
            >
              View track
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactReviewCard;