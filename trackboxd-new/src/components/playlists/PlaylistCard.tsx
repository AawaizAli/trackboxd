import { Heart } from "lucide-react";
import { useState } from "react";
import { Playlist } from "@/app/playlists/types";
import Link from "next/link";

interface PlaylistCardProps {
    playlist: Playlist;
    isLiked: boolean;
    isLoading: boolean;
    onLikeToggle: (id: string) => void;
}

export const PlaylistCard = ({
    playlist,
    isLiked,
    isLoading,
    onLikeToggle,
}: PlaylistCardProps) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleLikeClick = () => {
        setIsAnimating(true);
        onLikeToggle(playlist.id);
        setTimeout(() => setIsAnimating(false), 500);
    };

    return (
        <Link href={`/playlists/${playlist.id}`} className="group">
        <div className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
            {/* Cover Art */}
            <div className="relative">
                <img
                    src={playlist.cover_url}
                    alt={playlist.name}
                    className="w-full aspect-square object-cover"
                />
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-grow">
                        <h3 className="font-bold text-lg text-[#0C3B2E] truncate">
                            {playlist.name}
                        </h3>
                        <p className="text-[#6D9773] text-sm truncate mt-1">
                            by {playlist.creator}
                        </p>
                    </div>

                    {/* Like button and count */}
                    <div className="flex items-center ">
                        <button
                            onClick={handleLikeClick}
                            disabled={isLoading}
                            className={`group flex-shrink-0 p-2 rounded-full transition-colors ${
                                !isLoading
                                    ? "hover:bg-[#6D9773]/10 cursor-pointer"
                                    : "cursor-not-allowed"
                            }`}>
                            {isLoading ? (
                                <div className="w-5 h-5 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#6D9773]"></div>
                                </div>
                            ) : (
                                <Heart
                                    className={`w-5 h-5 transition-colors ${
                                        isLiked
                                            ? "text-[#6D9773] fill-[#6D9773]"
                                            : "text-[#A0A0A0] group-hover:text-[#6D9773]"
                                    }`}
                                />
                            )}
                        </button>
                        <span
                            className={`text-sm ${
                                isLiked
                                    ? "text-[#6D9773] font-medium"
                                    : "text-[#A0A0A0]"
                            }`}>
                            {playlist.like_count}
                        </span>
                    </div>
                </div>

                {/* Description */}
                {playlist.description && (
                    <p className="text-[#1F2C24] text-sm my-3 line-clamp-2 flex-grow">
                        {playlist.description}
                    </p>
                )}

                {/* Stats */}
                <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-center gap-1 text-[#A0A0A0] text-sm">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                        </svg>
                        <span>{playlist.tracks} tracks</span>
                    </div>
                </div>
            </div>
        </div>
        </Link>
    );
};
