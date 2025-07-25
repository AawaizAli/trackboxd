import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Review } from "@/app/songs/types";

interface ReviewCardProps {
    review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="relative">
                        <div className="w-4 h-4 mb-2 text-[#D9D9D9]">★</div>
                        <div
                            className="absolute top-0 left-0 w-5 h-5 text-[#FFBA00] overflow-hidden"
                            style={{
                                width: `${Math.max(0, Math.min(1, rating - star + 1)) * 100}%`,
                            }}>
                            ★
                        </div>
                    </div>
                ))}
                <span className="text-sm text-[#1F2C24] ml-1">{rating}</span>
            </div>
        );
    };

    const trackName = review.track_details?.name || "Unknown Track";
    const artistNames = review.track_details?.artists?.map(a => a.name).join(", ") || "Unknown Artist";
    const albumCover = review.track_details?.album?.images?.[0]?.url || "/default-album.png";
    
    return (
        <div className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start gap-3">
                <div className="w-16 h-16 relative overflow-hidden rounded-lg bg-gray-200 flex-shrink-0">
                    <img
                        src={albumCover}
                        alt={`${trackName} cover`}
                        className="w-full h-full object-cover"
                    />
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <img 
                            src={review.users.image_url} 
                            alt={review.users.name}
                            className="w-6 h-6 rounded-full"
                        />
                        <div className="font-medium text-[#1F2C24]">
                            {review.users.name}
                        </div>
                        {renderStars(review.rating)}
                    </div>

                    <h3 className="font-semibold text-[#1F2C24]">{trackName}</h3>
                    <p className="text-[#A0A0A0] text-sm">{artistNames}</p>
                    
                    {review.text && (
                        <p className="text-[#1F2C24] text-sm mt-2 line-clamp-2">
                            {review.text}
                        </p>
                    )}

                    <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center space-x-2 text-[#A0A0A0]">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{review.like_count}</span>
                            <span className="text-xs">
                                {new Date(review.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <Link
                            href={`/songs/${review.item_id}`}
                            className="text-xs text-[#6D9773] hover:text-[#5C8769]"
                        >
                            View track
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;
