import React from "react";
import Link from "next/link";
import { Heart, Star, MessageCircle } from "lucide-react";
import RatingStars from "../RatingStars";
import { Track } from "@/app/songs/types";

interface TrackCardProps {
    track: Track;
    viewMode: "grid" | "list";
    isLiked: boolean;
    isLoading: boolean;
    onLikeClick: (trackId: string) => void;
    onReviewClick: (track: Track) => void;
    onAnnotationClick: (track: Track) => void;
}

const TrackCard: React.FC<TrackCardProps> = ({
    track,
    viewMode,
    isLiked,
    isLoading,
    onLikeClick,
    onReviewClick,
    onAnnotationClick,
}) => {
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
        <Link href={`/songs/${track.id}`}>
            <div className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div
                    className={`p-4 ${
                        viewMode === "list" ? "flex items-center space-x-4" : ""
                    }`}>
                    <div
                        className={`${
                            viewMode === "list" ? "w-16 h-16" : "w-full h-48"
                        } relative overflow-hidden rounded-lg bg-gray-200`}>
                        <img
                            src={track.coverArt}
                            alt={`${track.title} cover`}
                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                        />
                    </div>

                    <div
                        className={`${
                            viewMode === "list" ? "flex-1" : "mt-3"
                        }`}>
                        <div
                            className={`${
                                viewMode === "list"
                                    ? "flex items-center justify-between"
                                    : ""
                            }`}>
                            <div
                                className={`${
                                    viewMode === "list" ? "flex-1" : ""
                                }`}>
                                <h3 className="font-semibold text-[#1F2C24] cursor-pointer hover:text-[#6D9773] transition-colors">
                                    {track.title}
                                </h3>
                                <p className="text-[#A0A0A0] text-sm truncate">
                                    {track.artist}
                                </p>
                                <p className="text-[#A0A0A0] text-xs truncate">
                                    {track.album}
                                </p>
                            </div>

                            <div
                                className={`${
                                    viewMode === "list"
                                        ? "flex items-center space-x-6"
                                        : "mt-2"
                                }`}>
                                {renderStars(track.avgRating)}
                                <div className="flex items-center space-x-1 text-[#A0A0A0]">
                                    <Heart className="w-4 h-4" />
                                    <span className="text-sm">
                                        {track.saveCount}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`${
                                viewMode === "list" ? "mt-2" : "mt-3"
                            } flex flex-wrap gap-2`}>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    onLikeClick(track.id);
                                }}
                                disabled={isLoading}
                                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                                    isLiked
                                        ? "bg-[#FFBA00] text-[#1F2C24]"
                                        : "bg-[#6D9773] text-[#F9F9F9] hover:bg-[#5C8769]"
                                }`}>
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <Heart className="w-3 h-3" />
                                        <span>
                                            {isLiked ? "Liked" : "Like"}
                                        </span>
                                    </>
                                )}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    onReviewClick(track);
                                }}
                                className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm bg-[#FFFFF0] text-[#1F2C24] border border-[#D9D9D9] hover:bg-[#E2E3DF] transition-colors">
                                <Star className="w-3 h-3" />
                                <span>Review</span>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    onAnnotationClick(track);
                                }}
                                className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm bg-[#FFFFF0] text-[#1F2C24] border border-[#D9D9D9] hover:bg-[#E2E3DF] transition-colors">
                                <MessageCircle className="w-3 h-3" />
                                <span>Annotate</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default TrackCard;
