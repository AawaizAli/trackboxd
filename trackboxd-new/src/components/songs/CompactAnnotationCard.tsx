import React from "react";
import Link from "next/link";
import { Annotation } from "@/app/songs/types";
import { Clock } from "lucide-react";

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (secondsAgo < 60) {
        return secondsAgo === 1 ? "1 second ago" : `${secondsAgo} seconds ago`;
    }

    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) {
        return minutesAgo === 1 ? "1 minute ago" : `${minutesAgo} minutes ago`;
    }

    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
        return hoursAgo === 1 ? "1 hour ago" : `${hoursAgo} hours ago`;
    }

    const daysAgo = Math.floor(hoursAgo / 24);
    return daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`;
};

const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

interface CompactAnnotationCardProps {
    annotation: Annotation;
}

const CompactAnnotationCard: React.FC<CompactAnnotationCardProps> = ({
    annotation,
}) => {
    const timeAgo = formatTimeAgo(annotation.created_at);
    const trackName = annotation.track_details?.name || "Unknown Track";
    const timestamp = formatDuration(annotation.timestamp || 0);

    const MAX_ARTISTS = 2;
    const artists = annotation.track_details?.artists || [];
    const artistNames =
        artists.length > MAX_ARTISTS
            ? `${artists
                  .slice(0, MAX_ARTISTS)
                  .map((a) => a.name)
                  .join(", ")} + ${artists.length - MAX_ARTISTS} more`
            : artists.map((a) => a.name).join(", ") || "Unknown Artist";

    return (
        <div className="bg-[#FFFBEb] border border-[#5C5537]/20 rounded-lg p-4 hover:shadow-lg transition-shadow duration-200 h-full">
            <div className="flex items-start gap-2 h-full">
                <div className="flex-1 min-w-0 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                        <img
                            src={annotation.users.image_url || "./default-avatar.jpg"}
                            alt={annotation.users.name}
                            className="w-6 h-6 rounded-full object-cover"
                            onError={(e) => {
                                e.currentTarget.src = "./default-avatar.jpg";
                            }}
                        />
                        <div className="font-medium text-[#5C5537]">
                            {annotation.users.name}
                        </div>
                        <div className="flex items-center text-[#5C5537]/70 text-xs">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{timestamp}</span>
                        </div>
                    </div>

                    <div className="mb-2">
                        <h3 className="font-semibold text-[#5C5537] text-sm">
                            {trackName}
                        </h3>
                        <p className="text-[#5C5537]/70 text-xs">
                            {artistNames}
                        </p>
                    </div>

                    {annotation.text && (
                        <p className="text-[#5C5537] text-sm line-clamp-2 mb-2 flex-1">
                            {annotation.text}
                        </p>
                    )}

                    <div className="flex justify-between items-center mt-auto">
                        <span className="text-xs text-[#5C5537]/70">
                            {timeAgo}
                        </span>
                        <Link
                            href={`/songs/${annotation.track_id}`}
                            className="text-xs text-[#5C5537]/70 hover:text-[#5C5537]">
                            View track
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompactAnnotationCard;