import { Heart } from "lucide-react";
import { Playlist } from "@/app/playlists/types";
import Link from "next/link";

interface PlaylistListItemProps {
  playlist: Playlist;
  onLikeToggle: (id: string) => void;
  isLastItem?: boolean;
  isLiked: boolean;
  isLoading?: boolean;
}

export const PlaylistListItem = ({
  playlist,
  onLikeToggle,
  isLastItem = false,
  isLiked,
  isLoading = false,
}: PlaylistListItemProps) => {
  return (
    <Link href={`/playlists/${playlist.id}`} className="group">
    <div
      className={`p-4 hover:bg-[#F9F9F6] transition-colors ${
        !isLastItem ? "border-b border-[#D9D9D9]" : ""
      }`}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <img
            src={playlist.cover_url}
            alt={playlist.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-[#0C3B2E] truncate">
                {playlist.name}
              </h3>
              <p className="text-[#6D9773] text-sm truncate">
                by {playlist.creator}
              </p>
            </div>
            
            {/* Like button and count */}
            <div className="flex items-center gap-1">
              
              <button
                onClick={() => !isLoading && onLikeToggle(playlist.id)}
                disabled={isLoading}
                className={`p-1 ${
                  isLoading ? "cursor-not-allowed" : "cursor-pointer"
                } ${
                  isLiked
                    ? "text-[#6D9773]"
                    : "text-[#A0A0A0] hover:text-[#6D9773]"
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#6D9773]"></div>
                  </div>
                ) : (
                  <Heart
                    className={`w-5 h-5 ${
                      isLiked ? "fill-[#6D9773]" : ""
                    }`}
                  />
                )}
              </button>
              <span className={`text-sm ${isLiked ? 'text-[#6D9773] font-medium' : 'text-[#A0A0A0]'}`}>
                {playlist.like_count}
              </span>
            </div>
          </div>

          <p className="text-[#1F2C24] text-sm my-2 line-clamp-2">
            {playlist.description}
          </p>

          {/* Stats - only track count remains */}
          <div className="flex items-center gap-1 text-[#A0A0A0] text-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
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