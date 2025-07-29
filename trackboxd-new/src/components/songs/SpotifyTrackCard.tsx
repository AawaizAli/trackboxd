import React from "react";
import Link from "next/link";
import { Heart, Star, MessageCircle } from "lucide-react";
import { SpotifyTrack } from "@/app/songs/types";

interface SpotifyTrackCardProps {
    track: SpotifyTrack;
    isLiked: boolean;
    isLoading: boolean;
    onLikeClick: (trackId: string) => void;
    onReviewClick: (track: SpotifyTrack) => void;
    onAnnotationClick: (track: SpotifyTrack) => void;
}

const SpotifyTrackCard: React.FC<SpotifyTrackCardProps> = ({
    track,
    isLiked,
    isLoading,
    onLikeClick,
    onReviewClick,
    onAnnotationClick,
}) => {
    return (
        <div className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <Link href={`/songs/${track.id}`}>
                <div className="cursor-pointer">
                    <div className="w-full h-48 relative overflow-hidden rounded-lg bg-gray-200">
                        <img
                            src={
                                track.album.images[0]?.url ||
                                "/default-album.png"
                            }
                            alt={`${track.name} cover`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                    </div>

                    <div className="mt-3 p-4">
                        <div>
                            <h3 className="font-semibold text-[#1F2C24] hover:text-[#6D9773] transition-colors">
                                {track.name}
                            </h3>
                            <p className="text-[#A0A0A0] text-sm truncate">
                                {track.artists.map((a) => a.name).join(", ")}
                            </p>
                            <p className="text-[#A0A0A0] text-xs truncate">
                                {track.album.name}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>

            <div className="px-4 pb-4">
                <div className="flex flex-wrap gap-2">
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
                                <span>{isLiked ? "Liked" : "Like"}</span>
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
    );
};

export default SpotifyTrackCard;