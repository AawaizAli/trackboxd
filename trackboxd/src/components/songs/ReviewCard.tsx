import React from "react";
import RatingStars from "../RatingStars";
import { Review } from "@/app/songs/types";
import { Heart } from "lucide-react";

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
                                width: `${
                                    Math.max(
                                        0,
                                        Math.min(1, rating - star + 1)
                                    ) * 100
                                }%`,
                            }}>
                            ★
                        </div>
                    </div>
                ))}
                <span className="text-sm text-[#1F2C24] ml-1">{rating}</span>
            </div>
        );
    };
    
    return (
        <div className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="font-medium text-[#1F2C24]">
                            {review.users.name}
                        </div>
                        {renderStars(review.rating)}
                    </div>
                    <p className="text-[#1F2C24] line-clamp-2 mb-2">
                        {review.users.name}
                    </p>
                </div>
                <div className="flex items-center space-x-1 text-[#A0A0A0]">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{review.users.name}</span>
                </div>
            </div>
            <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-[#A0A0A0]">
                    {review.users.name}
                </span>
                <button className="text-xs text-[#6D9773] hover:text-[#5C8769]">
                    Read full review
                </button>
            </div>
        </div>
    );
};

export default ReviewCard;
