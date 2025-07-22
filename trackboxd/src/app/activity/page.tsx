"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Heart,
    MessageCircle,
    Bookmark,
    Music,
    Album,
    List,
    Clock,
    Plus,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

// Mock data - combining both current user and friends activity
const allActivity = [
    {
        id: 1,
        user: {
            name: "Iznah Waqar",
            avatar: "/api/placeholder/40/40",
            username: "iznauurr",
        },
        type: "review",
        itemType: "track",
        title: "Blinding Lights",
        artist: "The Weeknd",
        rating: 4.5,
        content:
            "An absolute masterpiece that captures the essence of 80s synthwave...",
        timestamp: "2 hours ago",
        likes: 12,
        isCurrentUser: true,
    },
    {
        id: 6,
        user: {
            name: "Sarah Johnson",
            avatar: "/api/placeholder/40/40",
            username: "sarahj",
        },
        type: "review",
        itemType: "album",
        title: "folklore",
        artist: "Taylor Swift",
        rating: 5.0,
        content: "Every song tells a story. Pure poetry in musical form.",
        timestamp: "1 hour ago",
        likes: 34,
        isCurrentUser: false,
    },
    {
        id: 2,
        user: {
            name: "Iznah Waqar",
            avatar: "/api/placeholder/40/40",
            username: "iznauurr",
        },
        type: "review",
        itemType: "album",
        title: "After Hours",
        artist: "The Weeknd",
        rating: 4.0,
        content:
            "Solid album with great production values and emotional depth.",
        timestamp: "1 day ago",
        likes: 8,
        isCurrentUser: true,
    },
    {
        id: 7,
        user: {
            name: "Mike Rodriguez",
            avatar: "/api/placeholder/40/40",
            username: "mikerod",
        },
        type: "review",
        itemType: "track",
        title: "Levitating",
        artist: "Dua Lipa",
        rating: 4.0,
        content: "Perfect dance track for any occasion!",
        timestamp: "4 hours ago",
        likes: 16,
        isCurrentUser: false,
    },
    {
        id: 3,
        user: {
            name: "Iznah Waqar",
            avatar: "/api/placeholder/40/40",
            username: "iznauurr",
        },
        type: "save",
        itemType: "playlist",
        title: "Midnight Vibes",
        creator: "Sarah Johnson",
        tracks: 24,
        timestamp: "3 hours ago",
        isCurrentUser: true,
    },
    {
        id: 8,
        user: {
            name: "Emma Davis",
            avatar: "/api/placeholder/40/40",
            username: "emmad",
        },
        type: "save",
        itemType: "playlist",
        title: "Study Beats",
        creator: "Lo-Fi Collective",
        tracks: 89,
        timestamp: "6 hours ago",
        isCurrentUser: false,
    },
    {
        id: 4,
        user: {
            name: "Iznah Waqar",
            avatar: "/api/placeholder/40/40",
            username: "iznauurr",
        },
        type: "save",
        itemType: "track",
        title: "Save Your Tears",
        artist: "The Weeknd",
        timestamp: "5 hours ago",
        isCurrentUser: true,
    },
    {
        id: 9,
        user: {
            name: "Jordan Kim",
            avatar: "/api/placeholder/40/40",
            username: "jordank",
        },
        type: "annotation",
        track: "Watermelon Sugar",
        artist: "Harry Styles",
        content: "This bridge section at 2:14 gives me chills every time 🎵",
        timestamp: "2:14",
        likes: 7,
        timeAgo: "8 hours ago",
        isCurrentUser: false,
    },
    {
        id: 5,
        user: {
            name: "Iznah Waqar",
            avatar: "/api/placeholder/40/40",
            username: "iznauurr",
        },
        type: "playlist",
        title: "Road Trip Essentials",
        tracks: 47,
        followers: 23,
        timestamp: "2 days ago",
        isCurrentUser: true,
    },
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

const ActivityCard = ({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) => <div className={`p-4 ${className}`}>{children}</div>;

const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <div key={star} className="relative mb-2">
                <div className="w-4 h-4 text-[#D9D9D9]">★</div>
                <div
                    className="absolute top-0 left-0 w-5 h-5 text-[#FFBA00] overflow-hidden"
                    style={{
                        width: `${
                            Math.max(0, Math.min(1, rating - star + 1)) * 100
                        }%`,
                    }}>
                    ★
                </div>
            </div>
        ))}
        <span className="text-sm text-[#1F2C24] ml-1">{rating}</span>
    </div>
);

const UserAvatar = ({
    user,
    size = "w-10 h-10",
}: {
    user: any;
    size?: string;
}) => (
    <div
        className={`${size} rounded-full ring-2 ring-[#FFBA00] overflow-hidden flex-shrink-0`}>
        <Avatar className="w-full h-full">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-[#6D9773] text-[#F9F9F9]">
                {user.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
            </AvatarFallback>
        </Avatar>
    </div>
);

const ActivityItem = ({
    activity,
    isLast = false,
}: {
    activity: any;
    isLast?: boolean;
}) => {
    const renderContent = () => {
        switch (activity.type) {
            case "review":
                return (
                    <>
                        <div className="flex items-center gap-2 mb-1">
                            <UserAvatar user={activity.user} size="w-8 h-8" />
                            <span className="text-sm text-[#A0A0A0]">
                                {activity.isCurrentUser
                                    ? "You reviewed"
                                    : `${activity.user.name} reviewed`}
                            </span>
                            {activity.itemType === "track" && (
                                <Music className="w-4 h-4 text-[#FFBA00]" />
                            )}
                            {activity.itemType === "album" && (
                                <Album className="w-4 h-4 text-[#FFBA00]" />
                            )}
                        </div>
                        <div className="mb-2">
                            <h4 className="font-medium text-[#1F2C24]">
                                {activity.title}
                            </h4>
                            <p className="text-sm text-[#A0A0A0]">
                                by {activity.artist}
                            </p>
                        </div>
                        <RatingStars rating={activity.rating} />
                        <p className="text-sm text-[#1F2C24] mt-2 line-clamp-2">
                            {activity.content}
                        </p>
                    </>
                );
            case "save":
                return (
                    <>
                        <div className="flex items-center gap-2 mb-1">
                            <UserAvatar user={activity.user} size="w-8 h-8" />
                            <span className="text-sm text-[#A0A0A0]">
                                {activity.isCurrentUser
                                    ? "You liked"
                                    : `${activity.user.name} liked`}
                            </span>
                            {activity.itemType === "playlist" && (
                                <List className="w-4 h-4 text-[#FFBA00]" />
                            )}
                            {activity.itemType === "track" && (
                                <Music className="w-4 h-4 text-[#FFBA00]" />
                            )}
                        </div>
                        <div className="mb-2">
                            <h4 className="font-medium text-[#1F2C24]">
                                {activity.title}
                            </h4>
                            {activity.creator && (
                                <p className="text-sm text-[#A0A0A0]">
                                    by {activity.creator}
                                </p>
                            )}
                            {activity.artist && (
                                <p className="text-sm text-[#A0A0A0]">
                                    by {activity.artist}
                                </p>
                            )}
                            {activity.tracks && (
                                <p className="text-sm text-[#A0A0A0]">
                                    {activity.tracks} tracks
                                </p>
                            )}
                        </div>
                    </>
                );
            case "playlist":
                return (
                    <>
                        <div className="flex items-center gap-2 mb-1">
                            <UserAvatar user={activity.user} size="w-8 h-8" />
                            <span className="text-sm text-[#A0A0A0]">
                                You created playlist
                            </span>
                            <List className="w-4 h-4 text-[#FFBA00]" />
                        </div>
                        <div className="mb-2">
                            <h4 className="font-medium text-[#1F2C24]">
                                {activity.title}
                            </h4>
                            <p className="text-sm text-[#A0A0A0]">
                                {activity.tracks} tracks · {activity.followers}{" "}
                                followers
                            </p>
                        </div>
                    </>
                );
            case "annotation":
                return (
                    <>
                        <div className="flex items-center gap-2 mb-1">
                            <UserAvatar user={activity.user} size="w-8 h-8" />
                            <span className="text-sm text-[#A0A0A0]">
                                {activity.user.name} annotated
                            </span>
                            <Clock className="w-4 h-4 text-[#FFBA00]" />
                        </div>
                        <div className="mb-2">
                            <h4 className="font-medium text-[#1F2C24]">
                                {activity.track}
                            </h4>
                            <p className="text-sm text-[#A0A0A0]">
                                by {activity.artist} · at {activity.timestamp}
                            </p>
                        </div>
                        <p className="text-sm text-[#1F2C24] mb-2">
                            {activity.content}
                        </p>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative pl-3">
            {/* Timeline line */}
            <div
                className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#D9D9D9]"
                style={{ height: isLast ? "2.5rem" : "100%" }}
            />
            {/* Timeline dot */}
            <div className="absolute left-0 top-0 transform -translate-x-2/5 w-3 h-3 rounded-full bg-[#FFBA00] border-2 border-[#F9F9F6]" />

            <ActivityCard className="space-y-1">
                {renderContent()}
                <div className="flex items-center justify-between">
                    <span className="text-xs text-[#A0A0A0]">
                        {activity.timestamp || activity.timeAgo}
                    </span>
                    <div className="flex items-center gap-4">
                        {activity.likes !== undefined && (
                            <button className="flex items-center gap-1 text-sm text-[#A0A0A0] hover:text-[#6D9773]">
                                <Heart className="w-4 h-4" />
                                {activity.likes}
                            </button>
                        )}
                    </div>
                </div>
            </ActivityCard>
        </div>
    );
};

export default function ActivityPage() {
    return (
        <div className="min-h-screen bg-[#FFFFF0]">
            <Header />
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0C3B2E] mb-2">
                            Activity
                        </h1>
                        <p className="text-[#0C3B2E]/70">
                            See what you and your friends have been listening to
                        </p>
                    </div>
                    <button className="bg-[#FFBA00] text-[#1F2C24] px-4 py-3 rounded-lg font-bold hover:bg-[#FFBA00]/90 transition-colors flex items-center gap-2 shadow-md">
                        <Plus className="w-5 h-5" />
                        Log Something
                    </button>
                </div>

                {/* Combined Activity Feed */}
                <div>
                    <h2 className="text-2xl font-semibold text-[#0C3B2E] mb-6">
                        Recent Activity
                    </h2>
                    <div className="space-y-0">
                        {allActivity.map((activity, index) => (
                            <ActivityItem
                                key={activity.id}
                                activity={activity}
                                isLast={index === allActivity.length - 1}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <Footer variant="light" />
        </div>
    );
}