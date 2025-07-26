import React from "react";
import Link from "next/link";
import { Heart, Clock } from "lucide-react";
import { Annotation } from "@/app/songs/types";

const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (secondsAgo < 60) {
        return secondsAgo === 1 ? '1 second ago' : `${secondsAgo} seconds ago`;
    }
    
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) {
        return minutesAgo === 1 ? '1 minute ago' : `${minutesAgo} minutes ago`;
    }
    
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
        return hoursAgo === 1 ? '1 hour ago' : `${hoursAgo} hours ago`;
    }
    
    const daysAgo = Math.floor(hoursAgo / 24);
    return daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
};

const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

interface AnnotationCardProps {
    annotation: Annotation;
}

const AnnotationCard: React.FC<AnnotationCardProps> = ({ annotation }) => {
    const timeAgo = formatTimeAgo(annotation.created_at);
    const trackName = annotation.track_details?.name || "Unknown Track";
    const artistNames = annotation.track_details?.artists?.map(a => a.name).join(", ") || "Unknown Artist";
    const albumCover = annotation.track_details?.album?.images?.[0]?.url || "/default-album.png";
    const albumName = annotation.track_details?.album?.name || "Unknown Album";
    const timestamp = formatDuration(annotation.timestamp || 0);
    
    return (
        <div className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start gap-3">
                <div className="w-16 h-16 relative overflow-hidden rounded-lg bg-gray-200 flex-shrink-0">
                    <img
                        src={albumCover}
                        alt={`${trackName} cover`}
                        className="w-full h-full object-cover"
                    />
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <img 
                            src={annotation.users.image_url} 
                            alt={annotation.users.name}
                            className="w-6 h-6 rounded-full"
                        />
                        <div className="font-medium text-[#1F2C24]">
                            {annotation.users.name}
                        </div>
                        <span className="text-xs text-[#A0A0A0]">
                            annotated
                        </span>
                    </div>

                    <div className="mb-2">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-[#1F2C24]">{trackName}</h3>
                            <div className="flex items-center text-[#A0A0A0] text-sm">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>{timestamp}</span>
                            </div>
                        </div>
                        <p className="text-[#A0A0A0] text-sm">{artistNames}</p>
                        <p className="text-[#A0A0A0] text-xs italic">{albumName}</p>
                    </div>
                    
                    {annotation.text && (
                        <div className="mt-2 bg-[#F9F9F9] rounded-md p-3 text-sm text-[#1F2C24]">
                            <p className="line-clamp-3">
                                {annotation.text}
                            </p>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center space-x-2 text-[#A0A0A0]">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">{annotation.like_count}</span>
                            <span className="text-xs">
                                {timeAgo}
                            </span>
                        </div>
                        <Link
                            href={`/songs/${annotation.item_id}`}
                            className="text-xs text-[#6D9773] hover:text-[#5C8769]"
                        >
                            View track
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnotationCard;