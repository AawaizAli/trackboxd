"use client";

import React, { useState } from "react";
import { Search, X, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ReviewFormProps {
  onClose: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<any>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulated search results
    console.log("Searching for:", searchQuery);
  };

  const handleSelectTrack = (track: any) => {
    setSelectedTrack(track);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting review:", { selectedTrack, rating, reviewText });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!selectedTrack ? (
        <div className="space-y-4">
          <h3 className="font-medium text-[#1F2C24]">
            Search for a track or album to review
          </h3>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#A0A0A0]" />
            <Input
              type="search"
              placeholder="Search tracks or albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 py-6 rounded-xl bg-[#FFFFE7] border border-[#D9D9D9]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-5 h-5 text-[#A0A0A0]" />
              </button>
            )}
          </form>

          {/* Search Results (simplified) */}
          <div className="border rounded-lg p-4 bg-[#FFFFE7] border-[#D9D9D9]">
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 p-3 hover:bg-[#FFFFD5] rounded-lg cursor-pointer"
                  onClick={() => handleSelectTrack({ id: item.toString(), name: `Track ${item}` })}
                >
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div>
                    <h4 className="font-medium text-[#1F2C24]">Track {item}</h4>
                    <p className="text-sm text-[#A0A0A0]">Artist Name</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-[#1F2C24]">
              Reviewing: <span className="font-bold">{selectedTrack.name}</span>
            </h3>
            <button
              type="button"
              onClick={() => setSelectedTrack(null)}
              className="text-[#A0A0A0] hover:text-[#1F2C24]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 p-4 bg-[#FFFFE7] rounded-lg border border-[#D9D9D9]">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
            <div>
              <h4 className="font-bold text-[#1F2C24]">{selectedTrack.name}</h4>
              <p className="text-sm text-[#A0A0A0]">Artist Name • Album Name</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1F2C24] mb-2">
                Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? 'text-[#FFBA00]' : 'text-[#D9D9D9]'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2C24] mb-2">
                Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full p-4 rounded-lg border border-[#D9D9D9] bg-[#FFFFE7] min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#0C3B2E]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="border-[#D9D9D9] text-[#1F2C24] hover:bg-[#FFFFD5]"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#0C3B2E] hover:bg-[#0a3328] text-[#F9F9F9]"
              disabled={!rating}
            >
              Post Review
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default ReviewForm;