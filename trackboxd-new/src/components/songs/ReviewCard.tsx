import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Review } from "@/app/songs/types";
import useUser from "@/hooks/useUser";

interface ReviewCardProps {
    review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(review.like_count);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const { user } = useUser();

    // Check if user has liked this review on component mount
    useEffect(() => {
        const checkLikeStatus = async () => {
            if (!user) {
                setInitialLoad(false);
                return;
            }
            
            try {
                const response = await fetch(
                    `/api/like/review?userId=${user.id}&reviewId=${review.id}`
                );
                
                if (!response.ok) {
                    throw new Error("Failed to fetch like status");
                }
                
                const data = await response.json();
                setIsLiked(data.isLiked);
            } catch (error) {
                console.error("Error checking like status:", error);
            } finally {
                setInitialLoad(false);
            }
        };

        checkLikeStatus();
    }, [user, review.id]);

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="relative">
                        <div className="w-4 h-4 mb-2 text-[#5C5537]/30">★</div>
                        <div
                            className="absolute top-0 left-0 w-5 h-5 text-[#FFBA00] overflow-hidden"
                            style={{
                                width: `${Math.max(0, Math.min(1, rating - star + 1)) * 100}%`,
                            }}>
                            ★
                        </div>
                    </div>
                ))}
                <span className="text-sm text-[#5C5537] ml-1">{rating}</span>
            </div>
        );
    };

    const handleLikeClick = async () => {
        if (isLoading || !user || initialLoad) return;

        setIsLoading(true);
        setIsAnimating(true);

        try {
            const newLikedState = !isLiked;
            const newCount = newLikedState ? likeCount + 1 : Math.max(0, likeCount - 1);

            // Optimistic UI update
            setIsLiked(newLikedState);
            setLikeCount(newCount);

            const response = await fetch("/api/like/review", {
                method: newLikedState ? "POST" : "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    reviewId: review.id,
                }),
            });

            if (!response.ok) throw new Error("Failed to update like status");

            setTimeout(() => setIsAnimating(false), 500);
        } catch (error) {
            console.error("Like operation failed:", error);
            setIsLiked(!isLiked);
            setLikeCount(review.like_count);
        } finally {
            setIsLoading(false);
        }
    };

    const trackName = review.track_details?.name || "Unknown Track";
    const artistNames = review.track_details?.artists?.map(a => a.name).join(", ") || "Unknown Artist";
    const albumCover = review.track_details?.album?.images?.[0]?.url || "./default-avatar.jpg";
    const userImage = review.users.image_url || "./default-avatar.jpg";
    
    return (
        <div className="bg-[#FFFBEb] border border-[#5C5537]/20 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start gap-3">
                <div className="w-16 h-16 relative overflow-hidden rounded-lg bg-[#5C5537]/10 flex-shrink-0">
                    <img
                        src={albumCover}
                        alt={`${trackName} cover`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src = "./default-avatar.jpg";
                        }}
                    />
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <img 
                            src={userImage} 
                            alt={review.users.name}
                            className="w-6 h-6 rounded-full"
                            onError={(e) => {
                                e.currentTarget.src = "./default-avatar.jpg";
                            }}
                        />
                        <div className="font-medium text-[#5C5537]">
                            {review.users.name}
                        </div>
                        {renderStars(review.rating)}
                    </div>

                    <h3 className="font-semibold text-[#5C5537]">{trackName}</h3>
                    <p className="text-[#5C5537]/70 text-sm">{artistNames}</p>
                    
                    {review.text && (
                        <p className="text-[#5C5537] text-sm mt-2 line-clamp-2">
                            {review.text}
                        </p>
                    )}

                    <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={handleLikeClick}
                                disabled={isLoading || initialLoad || !user}
                                className={`group flex items-center space-x-1 focus:outline-none ${
                                    isLoading || initialLoad 
                                        ? 'cursor-not-allowed' 
                                        : user ? 'cursor-pointer' : 'cursor-default'
                                }`}
                            >
                                {initialLoad ? (
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#5C5537]"></div>
                                    </div>
                                ) : (
                                    <Heart 
                                        className={`w-4 h-4 transition-all duration-200 ${
                                            isLiked 
                                                ? 'text-[#5C5537] fill-[#5C5537]' 
                                                : user 
                                                    ? 'text-[#5C5537]/70 group-hover:text-[#5C5537]' 
                                                    : 'text-[#5C5537]/70'
                                        }`}
                                    />
                                )}
                                <span className={`text-sm transition-colors duration-200 ${
                                    isLiked 
                                        ? 'text-[#5C5537] font-medium' 
                                        : user 
                                            ? 'text-[#5C5537]/70 group-hover:text-[#5C5537]' 
                                            : 'text-[#5C5537]/70'
                                }`}>
                                    {likeCount}
                                </span>
                            </button>
                            <span className="text-xs text-[#5C5537]/70">
                                {new Date(review.created_at).toLocaleDateString()}
                            </span>
                        </div>
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

export default ReviewCard;