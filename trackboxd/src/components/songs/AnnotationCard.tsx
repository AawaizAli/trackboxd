import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Clock } from "lucide-react";
import { Annotation } from "@/app/songs/types";
import useUser from "@/hooks/useUser";

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
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(annotation.like_count);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const { user } = useUser();
    
    const timeAgo = formatTimeAgo(annotation.created_at);
    const trackName = annotation.track_details?.name || "Unknown Track";
    const artistNames = annotation.track_details?.artists?.map(a => a.name).join(", ") || "Unknown Artist";
    const albumCover = annotation.track_details?.album?.images?.[0]?.url || "/default-album.png";
    const albumName = annotation.track_details?.album?.name || "Unknown Album";
    const timestamp = formatDuration(annotation.timestamp || 0);

    // Check like status on component mount
    useEffect(() => {
        const checkLikeStatus = async () => {
            if (!user) {
                setInitialLoad(false);
                return;
            }
            
            try {
                const response = await fetch(
                    `/api/like/annotation?userId=${user.id}&annotationId=${annotation.id}`
                );
                
                if (!response.ok) throw new Error("Failed to fetch like status");
                
                const data = await response.json();
                setIsLiked(data.isLiked);
            } catch (error) {
                console.error("Error checking like status:", error);
            } finally {
                setInitialLoad(false);
            }
        };

        checkLikeStatus();
    }, [user, annotation.id]);

    const handleLikeClick = async () => {
        if (isLoading || !user || initialLoad) return;

        setIsLoading(true);
        setIsAnimating(true);

        try {
            const newLikedState = !isLiked;
            const newCount = newLikedState ? likeCount + 1 : Math.max(0, likeCount - 1);

            // Optimistic UI update
            setIsLiked(newLikedState);
            setLikeCount(newCount);

            const response = await fetch("/api/like/annotation", {
                method: newLikedState ? "POST" : "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    annotationId: annotation.id,
                }),
            });

            if (!response.ok) throw new Error("Failed to update like status");

            setTimeout(() => setIsAnimating(false), 500);
        } catch (error) {
            console.error("Like operation failed:", error);
            setIsLiked(!isLiked);
            setLikeCount(annotation.like_count);
        } finally {
            setIsLoading(false);
        }
    };
    
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
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={handleLikeClick}
                                disabled={isLoading || initialLoad || !user}
                                className={`group flex items-center space-x-1 focus:outline-none ${
                                    isLoading || initialLoad 
                                        ? 'cursor-not-allowed' 
                                        : user ? 'cursor-pointer' : 'cursor-default'
                                }`}
                            >
                                {initialLoad ? (
                                    <div className="w-4 h-4 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#6D9773]"></div>
                                    </div>
                                ) : (
                                    <Heart 
                                        className={`w-4 h-4 transition-all duration-200 ${
                                            isLiked 
                                                ? 'text-[#6D9773] fill-[#6D9773]' 
                                                : user 
                                                    ? 'text-[#A0A0A0] group-hover:text-[#6D9773]' 
                                                    : 'text-[#A0A0A0]'
                                        }`}
                                    />
                                )}
                                <span className={`text-sm transition-colors duration-200 ${
                                    isLiked 
                                        ? 'text-[#6D9773] font-medium' 
                                        : user 
                                            ? 'text-[#A0A0A0] group-hover:text-[#6D9773]' 
                                            : 'text-[#A0A0A0]'
                                }`}>
                                    {likeCount}
                                </span>
                            </button>
                            <span className="text-xs text-[#A0A0A0]">
                                {timeAgo}
                            </span>
                        </div>
                        <Link
                            href={`/songs/${annotation.track_id}`}
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