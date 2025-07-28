import { Heart } from "lucide-react";
import { Playlist } from "@/app/playlists/types";

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
}: PlaylistListItemProps) => {
  return (
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
            <h3 className="font-bold text-[#0C3B2E] truncate">
              {playlist.name}
            </h3>
            <button
              onClick={() => onLikeToggle(playlist.id)}
              className={`p-1 ${
                isLiked
                  ? "text-[#FF3C57]"
                  : "text-[#A0A0A0] hover:text-[#FF3C57]"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  isLiked ? "fill-[#FF3C57]" : ""
                }`}
              />
            </button>
          </div>

          <p className="text-[#6D9773] text-sm mb-1">by {playlist.creator}</p>
          <p className="text-[#1F2C24] text-sm mb-2 line-clamp-2">
            {playlist.description}
          </p>

          <div className="flex justify-between items-center">
            <div className="flex gap-4">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>
                  {playlist.like_count} likes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};