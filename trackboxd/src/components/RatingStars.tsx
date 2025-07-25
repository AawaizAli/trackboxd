import React from "react";

interface RatingStarsProps {
  rating: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div key={star} className="relative">
          <div className="w-4 h-4 mb-2 text-[#D9D9D9]">★</div>
          <div
            className="absolute top-0 left-0 w-5 h-5 text-[#FFBA00] overflow-hidden"
            style={{
              width: `${Math.max(0, Math.min(1, rating - star + 1)) * 100}%`,
            }}
          >
            ★
          </div>
        </div>
      ))}
      <span className="text-sm text-[#1F2C24] ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};

export default RatingStars;