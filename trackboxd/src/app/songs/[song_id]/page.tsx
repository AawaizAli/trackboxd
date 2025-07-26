"use client";

import React, { useState, useEffect } from "react";
import { Heart, Star, MessageCircle, Bookmark } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Review {
    id: string;
    user: string;
    rating: number;
    content: string;
    timestamp: string;
    likes: number;
}

interface Annotation {
    id: string;
    user: string;
    content: string;
    timestamp: string;
    likes: number;
}

interface SpotifyTrack {
    id: string;
    name: string;
    preview_url: string | null;
    album: {
        name: string;
        images: { url: string }[];
        release_date: string;
    };
    artists: { name: string }[];
    duration_ms: number;
    popularity: number;
    external_urls: {
        spotify: string;
    };
    stats?: {
        like_count: number;
        review_count: number;
        annotation_count: number;
        avg_rating: number;
    };
}

const TrackDetailsPage = ({ params }: { params: { song_id: string } }) => {
    const [track, setTrack] = useState<SpotifyTrack | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"reviews" | "annotations">(
        "reviews"
    );
    const [ratingDistribution, setRatingDistribution] = useState([
        0, 0, 0, 0, 0,
    ]);

    useEffect(() => {
        const fetchRatingDistribution = async () => {
            try {
                const res = await fetch(
                    `/api/review/distribution/${params.song_id}`
                );
                if (res.ok) {
                    const data = await res.json();
                    // Convert to array format [1-star%, 2-star%, ...]
                    setRatingDistribution([
                        data.percentages[1],
                        data.percentages[2],
                        data.percentages[3],
                        data.percentages[4],
                        data.percentages[5],
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch rating distribution:", error);
            }
        };

        fetchRatingDistribution();
    }, []);

    const trackStats = {
        likes: track?.stats?.like_count || 0,
        reviews: track?.stats?.review_count || 0,
        annotations: track?.stats?.annotation_count || 0,
        avgRating: track?.stats?.avg_rating || 0,
        // Default rating distribution (you might want to fetch this separately)
        ratingDistribution: [5, 15, 20, 40, 20],
    };

    // Mock reviews and annotations (would come from your API)
    const reviews: Review[] = [
        {
            id: "r1",
            user: "Sarah Johnson",
            rating: 5.0,
            content: "This song changed my life! Pure emotion in every note.",
            timestamp: "2 days ago",
            likes: 42,
        },
        {
            id: "r2",
            user: "Mike Rodriguez",
            rating: 4.5,
            content:
                "The production quality is insane. Best track of the year!",
            timestamp: "1 day ago",
            likes: 31,
        },
        {
            id: "r3",
            user: "Emma Davis",
            rating: 4.0,
            content:
                "Solid track with a beautiful melody. Worth multiple listens.",
            timestamp: "3 days ago",
            likes: 28,
        },
    ];

    const annotations: Annotation[] = [
        {
            id: "a1",
            user: "Taylor Swift",
            content:
                "The bridge at 2:45 gives me chills every time! Pure emotion.",
            timestamp: "1 day ago",
            likes: 24,
        },
        {
            id: "a2",
            user: "John Mayer",
            content: "Listen to the guitar solo at 3:15 - absolute perfection!",
            timestamp: "2 days ago",
            likes: 32,
        },
        {
            id: "a3",
            user: "Beyoncé",
            content:
                "The vocal harmonies at 1:30 are everything! Queen behavior.",
            timestamp: "3 days ago",
            likes: 41,
        },
    ];

    useEffect(() => {
        const fetchTrackDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/songs/${params.song_id}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch track details");
                }

                const data = await response.json();
                setTrack(data);
            } catch (err) {
                setError((err as Error).message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchTrackDetails();
    }, [params.song_id]);

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0).padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

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
                <span className="text-sm text-[#1F2C24] ml-1">
                    {rating.toFixed(1)}
                </span>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFFFF0]">
                <Header />
                <div className="max-w-5xl mx-auto px-4 py-8 flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6D9773]"></div>
                </div>
                <Footer variant="light" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#FFFFF0]">
                <Header />
                <div className="max-w-5xl mx-auto px-4 py-8 text-center">
                    <p className="text-red-500">{error}</p>
                </div>
                <Footer variant="light" />
            </div>
        );
    }

    if (!track) {
        return (
            <div className="min-h-screen bg-[#FFFFF0]">
                <Header />
                <div className="max-w-5xl mx-auto px-4 py-8 text-center">
                    <p>Track not found</p>
                </div>
                <Footer variant="light" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFFF0]">
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-6">
                {/* Compact Track Header */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="w-full md:w-1/3 flex justify-center">
                        <div className="w-56 h-56 relative overflow-hidden rounded-xl shadow border border-[#D9D9D9]">
                            <img
                                src={
                                    track.album.images[0]?.url ||
                                    "/default-album.png"
                                }
                                alt={`${track.name} cover`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-2/3">
                        <h1 className="text-2xl md:text-3xl font-bold text-[#0C3B2E] mb-1">
                            {track.name}
                        </h1>
                        <p className="text-lg text-[#6D9773] mb-4">
                            {track.artists.map((a) => a.name).join(", ")}
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div>
                                <p className="text-xs text-[#A0A0A0]">Album</p>
                                <p className="text-sm font-medium">
                                    {track.album.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-[#A0A0A0]">
                                    Release Date
                                </p>
                                <p className="text-sm font-medium">
                                    {new Date(
                                        track.album.release_date
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-[#A0A0A0]">
                                    Duration
                                </p>
                                <p className="text-sm font-medium">
                                    {formatDuration(track.duration_ms)}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs bg-[#6D9773] text-[#F9F9F9] hover:bg-[#5C8769]">
                                <Heart className="w-3 h-3" />
                                <span>Like</span>
                            </button>
                            <button className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs bg-[#FFFFF0] text-[#1F2C24] border border-[#D9D9D9] hover:bg-[#E2E3DF]">
                                <Star className="w-3 h-3" />
                                <span>Review</span>
                            </button>
                            <button className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs bg-[#FFFFF0] text-[#1F2C24] border border-[#D9D9D9] hover:bg-[#E2E3DF]">
                                <MessageCircle className="w-3 h-3" />
                                <span>Annotate</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="grid grid-cols-4 gap-2 border-y border-[#D9D9D9] py-5">
                        <div className="text-center">
                            <div className="text-xl font-bold text-[#0C3B2E]">
                                {trackStats.likes}
                            </div>
                            <div className="text-xs text-[#A0A0A0] flex items-center justify-center">
                                <Heart className="w-3 h-3 mr-1" /> Likes
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-[#0C3B2E]">
                                {trackStats.reviews}
                            </div>
                            <div className="text-xs text-[#A0A0A0] flex items-center justify-center">
                                <Star className="w-3 h-3 mr-1" /> Reviews
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-[#0C3B2E]">
                                {trackStats.annotations}
                            </div>
                            <div className="text-xs text-[#A0A0A0] flex items-center justify-center">
                                <MessageCircle className="w-3 h-3 mr-1" />{" "}
                                Annotations
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-[#0C3B2E]">
                                {trackStats.avgRating.toFixed(1)}
                            </div>
                            <div className="text-xs text-[#A0A0A0]">
                                Avg Rating
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compact Rating Distribution */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-[#0C3B2E] mb-3">
                        Rating Distribution
                    </h2>
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((stars, index) => (
                            <div key={stars} className="flex items-center">
                                <div className="w-12 text-sm">{stars}★</div>
                                <div className="flex-1 ml-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-[#6D9773] h-2 rounded-full"
                                            style={{
                                                width: `${
                                                    ratingDistribution[
                                                        5 - stars
                                                    ]
                                                }%`,
                                            }}></div>
                                    </div>
                                </div>
                                <div className="w-10 text-right text-xs text-[#A0A0A0]">
                                    {ratingDistribution[5 - stars]}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews & Annotations Tabs */}
                <div className="mb-6">
                    <div className="flex border-b border-[#D9D9D9]">
                        <button
                            className={`py-2 px-4 text-sm font-medium ${
                                activeTab === "reviews"
                                    ? "text-[#6D9773] border-b-2 border-[#6D9773]"
                                    : "text-[#A0A0A0]"
                            }`}
                            onClick={() => setActiveTab("reviews")}>
                            Reviews ({reviews.length})
                        </button>
                        <button
                            className={`py-2 px-4 text-sm font-medium ${
                                activeTab === "annotations"
                                    ? "text-[#6D9773] border-b-2 border-[#6D9773]"
                                    : "text-[#A0A0A0]"
                            }`}
                            onClick={() => setActiveTab("annotations")}>
                            Annotations ({annotations.length})
                        </button>
                    </div>

                    {activeTab === "reviews" && (
                        <div className="mt-4 space-y-4">
                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="bg-white border border-[#D9D9D9] rounded p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="font-medium text-sm text-[#1F2C24] mb-1">
                                                {review.user}
                                            </div>
                                            <div className="flex items-center">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1 text-[#A0A0A0] text-xs">
                                            <Heart className="w-3 h-3" />
                                            <span>{review.likes}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-[#1F2C24] mb-3 line-clamp-2">
                                        {review.content}
                                    </p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-[#A0A0A0]">
                                            {review.timestamp}
                                        </span>
                                        <button className="text-[#6D9773] hover:text-[#5C8769]">
                                            Read full
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "annotations" && (
                        <div className="mt-4 space-y-4">
                            {annotations.map((annotation) => (
                                <div
                                    key={annotation.id}
                                    className="bg-white border border-[#D9D9D9] rounded p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-medium text-sm text-[#1F2C24]">
                                            {annotation.user}
                                        </div>
                                        <div className="flex items-center space-x-1 text-[#A0A0A0] text-xs">
                                            <Heart className="w-3 h-3" />
                                            <span>{annotation.likes}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-[#1F2C24] mb-3 line-clamp-2">
                                        {annotation.content}
                                    </p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-[#A0A0A0]">
                                            {annotation.timestamp}
                                        </span>
                                        <button className="text-[#6D9773] hover:text-[#5C8769]">
                                            View annotation
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer variant="light" />
        </div>
    );
};

export default TrackDetailsPage;
