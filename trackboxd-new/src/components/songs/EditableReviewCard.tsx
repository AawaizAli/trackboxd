import React, { useState } from "react";
import { Edit, Trash } from "lucide-react";
import { Review } from "@/app/songs/types";
import ReviewForm from "@/components/log/forms/ReviewForm";

interface EditableReviewCardProps {
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (reviewId: string) => void;
}

const EditableReviewCard: React.FC<EditableReviewCardProps> = ({ 
  review, 
  onEdit, 
  onDelete 
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

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

  const handleSave = (updatedReview: any) => {
    onEdit({
      ...review,
      ...updatedReview
    });
    setIsEditMode(false);
  };

  return (
    <div className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-lg p-4 mb-4 relative">
      {isEditMode ? (
        <ReviewForm 
          onClose={() => setIsEditMode(false)}
          onSave={handleSave}
          initialReview={{
            id: review.id,
            rating: review.rating,
            text: review.text,
            isPublic: review.is_public,
            track: {
              id: review.item.id,
              name: review.item.name,
              artist: review.item.artist,
              album: review.item.album,
              coverArt: review.item.cover_url
            }
          }}
        />
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 relative overflow-hidden rounded-lg bg-gray-200 flex-shrink-0">
                <img
                  src={review.item.cover_url || "/default-album.png"}
                  alt={`${review.item.name} cover`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-semibold text-[#1F2C24]">
                  {review.item.name}
                </div>
                <div className="text-[#A0A0A0] text-xs">
                  {review.item.artist} • {review.item.type}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditMode(true)}
                className="p-1 text-[#6D9773] hover:text-[#5C8769]"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => onDelete(review.id)}
                className="p-1 text-red-500 hover:text-red-700"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>

          <div className="mb-2">
            {renderStars(review.rating)}
          </div>
          
          {review.text && (
            <p className="text-[#1F2C24] text-sm mb-3">
              {review.text}
            </p>
          )}
          
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1 text-[#A0A0A0]">
              <span className={`px-2 py-1 rounded-full ${
                review.is_public 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {review.is_public ? "Public" : "Private"}
              </span>
            </div>
            <div className="text-[#A0A0A0]">
              {new Date(review.created_at).toLocaleDateString()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EditableReviewCard;