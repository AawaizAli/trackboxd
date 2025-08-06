"use client";

import React, { useState, useEffect } from "react";
import { Heart, Star, MessageCircle, Bookmark } from "lucide-react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useUser from "@/hooks/useUser";
import ReviewForm from "@/components/log/forms/ReviewForm";
import { spotifyToTrack } from "@/utils/trackConverters";
import Link from "next/link";

interface Review {
    id: string;
    rating: number;
    text: string;
    created_at: string;
    like_count: number;
    is_public: boolean;
    users: {
        id: string;
        name: string;
        image_url: string;
    };
}

interface SpotifyAlbum {
    id: string;
    name: string;
    images: { url: string }[];
    release_date: string;
    artists: { id: string; name: string }[];
    total_tracks: number;
    album_type: string;
    external_urls: {
        spotify: string;
    };
    tracks?: {
        items: SpotifyTrack[];
        total: number;
    };
    stats?: {
        like_count: number;
        review_count: number;
        avg_rating: number;
    };
}

interface SpotifyTrack {
    id: string;
    name: string;
    preview_url: string | null;
    duration_ms: number;
    artists: { name: string }[];
    track_number: number;
    external_urls: {
        spotify: string;
    };
}

const AlbumDetailsPage = () => {
    const params = useParams();
    const albumId = params.album_id as string;

    const [album, setAlbum] = useState<SpotifyAlbum | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"tracks" | "reviews">("tracks");
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [reviewsError, setReviewsError] = useState<string | null>(null);
    const [ratingDistribution, setRatingDistribution] = useState([
        0, 0, 0, 0, 0,
    ]);

    const { user } = useUser();
    const [isLiked, setIsLiked] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    // Fetch album details
    useEffect(() => {
        const fetchAlbumDetails = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/albums/${albumId}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch album details");
                }

                const data = await response.json();
                setAlbum(data.album);
            } catch (err) {
                setError((err as Error).message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        if (albumId) {
            fetchAlbumDetails();
        }
    }, [albumId]);

    // Fetch reviews for the album
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoadingReviews(true);
                setReviewsError(null);

                const res = await fetch(`/api/review/${albumId}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch reviews");
                }

                const data = await res.json();
                setReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setReviewsError("Failed to load reviews");
            } finally {
                setLoadingReviews(false);
            }
        };

        if (albumId) {
            fetchReviews();
        }
    }, [albumId]);

    // Fetch rating distribution
    useEffect(() => {
        const fetchRatingDistribution = async () => {
            try {
                const res = await fetch(`/api/review/distribution/${albumId}`);
                if (res.ok) {
                    const data = await res.json();
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

        if (albumId) {
            fetchRatingDistribution();
        }
    }, [albumId]);

    // Fetch like status
    useEffect(() => {
        const fetchLikeStatus = async () => {
            if (!user || !album) return;

            try {
                const res = await fetch(
                    `/api/like/album?userId=${user.id}&albumId=${album.id}`
                );
                if (res.ok) {
                    const data = await res.json();
                    setIsLiked(data.isLiked);
                }
            } catch (error) {
                console.error("Failed to fetch like status", error);
            }
        };

        fetchLikeStatus();
    }, [user, album]);

    // Handle like click
    const handleLikeClick = async () => {
        if (!user) {
            window.location.href = "/";
            return;
        }

        if (!album) return;

        setLikeLoading(true);
        const newIsLiked = !isLiked;

        try {
            const method = newIsLiked ? "POST" : "DELETE";
            const res = await fetch("/api/like/album", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, albumId: album.id }),
            });

            if (res.ok) {
                setIsLiked(newIsLiked);
                // Update album stats
                setAlbum((prev) => {
                    if (!prev) return null;

                    const currentStats = prev.stats
                        ? { ...prev.stats }
                        : {
                              like_count: 0,
                              review_count: 0,
                              avg_rating: 0,
                          };

                    const newStats = {
                        ...currentStats,
                        like_count:
                            currentStats.like_count + (newIsLiked ? 1 : -1),
                    };

                    return {
                        ...prev,
                        stats: newStats,
                    };
                });
            }
        } catch (error) {
            console.error("Like operation failed:", error);
        } finally {
            setLikeLoading(false);
        }
    };

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0).padStart(2, "0");
        return `${minutes}:${seconds}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
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

    if (!album) {
        return (
            <div className="min-h-screen bg-[#FFFFF0]">
                <Header />
                <div className="max-w-5xl mx-auto px-4 py-8 text-center">
                    <p>Album not found</p>
                </div>
                <Footer variant="light" />
            </div>
        );
    }

    const albumStats = {
        likes: album?.stats?.like_count || 0,
        reviews: album?.stats?.review_count || 0,
        avgRating: album?.stats?.avg_rating || 0,
    };

    return (
        <div className="min-h-screen bg-[#FFFFF0]">
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-6">
                {/* Album Header */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    <div className="w-full md:w-1/3 flex justify-center">
                        <div className="w-56 h-56 relative overflow-hidden rounded-xl shadow border border-[#D9D9D9]">
                            <img
                                src={
                                    album.images[0]?.url || "/default-album.png"
                                }
                                alt={`${album.name} cover`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-2/3">
                        <h1 className="text-2xl md:text-3xl font-bold text-[#0C3B2E] mb-1">
                            {album.name}
                        </h1>
                        <p className="text-lg text-[#6D9773] mb-4">
                            {album.artists.map((a) => a.name).join(", ")}
                        </p>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div>
                                <p className="text-xs text-[#A0A0A0]">
                                    Release Date
                                </p>
                                <p className="text-sm font-medium">
                                    {new Date(
                                        album.release_date
                                    ).toLocaleDateString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-[#A0A0A0]">Type</p>
                                <p className="text-sm font-medium capitalize">
                                    {album.album_type}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-[#A0A0A0]">
                                    Total Tracks
                                </p>
                                <p className="text-sm font-medium">
                                    {album.total_tracks}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={handleLikeClick}
                                disabled={likeLoading}
                                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
                                    isLiked
                                        ? "bg-[#FFBA00] text-[#1F2C24]"
                                        : "bg-[#6D9773] text-[#F9F9F9] hover:bg-[#5C8769]"
                                }`}>
                                {likeLoading ? (
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
                                onClick={() => album && setShowReviewForm(true)}
                                className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs bg-[#FFFFF0] text-[#1F2C24] border border-[#D9D9D9] hover:bg-[#E2E3DF] cursor-pointer">
                                <span>Review</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="grid grid-cols-3 gap-2 border-y border-[#D9D9D9] py-5">
                        <div className="text-center">
                            <div className="text-xl font-bold text-[#0C3B2E]">
                                {albumStats.likes}
                            </div>
                            <div className="text-xs text-[#A0A0A0] flex items-center justify-center">
                                <Heart className="w-3 h-3 mr-1" /> Likes
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-[#0C3B2E]">
                                {albumStats.reviews}
                            </div>
                            <div className="text-xs text-[#A0A0A0] flex items-center justify-center">
                                <Star className="w-3 h-3 mr-1" /> Reviews
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-[#0C3B2E]">
                                {albumStats.avgRating.toFixed(1)}
                            </div>
                            <div className="text-xs text-[#A0A0A0]">
                                Avg Rating
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rating Distribution */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-[#0C3B2E] mb-3">
                        Rating Distribution
                    </h2>
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((stars, index) => (
                            <div key={stars} className="flex items-center">
                                <div className="w-12 text-sm">{stars}★</div>
                                <div className="flex-1 ml-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-[#6D9773] h-2 rounded-full"
                                            style={{
                                                width: `${
                                                    ratingDistribution[
                                                        stars - 1
                                                    ]
                                                }%`,
                                            }}></div>
                                    </div>
                                </div>
                                <div className="w-10 text-right text-xs text-[#A0A0A0]">
                                    {ratingDistribution[stars - 1]}%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tracks & Reviews Tabs */}
                <div className="mb-6">
                    <div className="flex border-b border-[#D9D9D9]">
                        <button
                            className={`py-2 px-4 text-sm font-medium ${
                                activeTab === "tracks"
                                    ? "text-[#6D9773] border-b-2 border-[#6D9773]"
                                    : "text-[#A0A0A0]"
                            } cursor-pointer`}
                            onClick={() => setActiveTab("tracks")}>
                            Tracks ({album.total_tracks})
                        </button>
                        <button
                            className={`py-2 px-4 text-sm font-medium ${
                                activeTab === "reviews"
                                    ? "text-[#6D9773] border-b-2 border-[#6D9773]"
                                    : "text-[#A0A0A0]"
                            } cursor-pointer`}
                            onClick={() => setActiveTab("reviews")}>
                            Reviews ({reviews.length})
                        </button>
                    </div>

                    {activeTab === "tracks" && album.tracks?.items && (
                        <div className="mt-4">
                            <div className="grid grid-cols-[50px_1fr_80px] gap-4 px-4 py-2 text-sm text-[#A0A0A0] border-b border-[#D9D9D9]">
                                <div>#</div>
                                <div>Title</div>
                                <div className="text-right">Duration</div>
                            </div>
                            {album.tracks.items.map((track) => (
                                <div
                                    key={track.id}
                                    className="grid grid-cols-[50px_1fr_80px] gap-4 px-4 py-3 hover:bg-[#FFFFF5] rounded-lg">
                                    <div className="text-[#A0A0A0]">
                                        {track.track_number}
                                    </div>
                                    <div>
                                        <Link
                                            href={`/songs/${track.id}`}
                                            className="font-medium text-[#0C3B2E] hover:text-[#6D9773]">
                                            {track.name}
                                        </Link>
                                        <div className="text-sm text-[#6D9773]">
                                            {track.artists
                                                .map((a) => a.name)
                                                .join(", ")}
                                        </div>
                                    </div>
                                    <div className="text-right text-[#A0A0A0]">
                                        {formatDuration(track.duration_ms)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "reviews" && (
                        <div className="mt-4 space-y-4">
                            {reviews.length === 0 && !loadingReviews && (
                                <div className="text-center py-8 text-[#A0A0A0]">
                                    No reviews yet. Be the first to review this
                                    album!
                                </div>
                            )}

                            {reviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-xl p-4">
                                    <div className="flex justify-between items-start min-h-[3.5rem]">
                                        <div className="flex items-start gap-3">
                                            <img
                                                src={review.users.image_url}
                                                alt={review.users.name}
                                                className="w-10 h-10 rounded-full mt-0.5"
                                            />
                                            <div>
                                                <div className="font-medium text-sm text-[#1F2C24]">
                                                    {review.users.name}
                                                </div>
                                                <div className="mt-1">
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-[#1F2C24] mb-3 line-clamp-2">
                                        {review.text}
                                    </p>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-[#A0A0A0]">
                                            {formatDate(review.created_at)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {showReviewForm && album && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div
                                className="absolute inset-0 bg-black/50 bg-opacity-20"
                                onClick={() => setShowReviewForm(false)}></div>
                            <div className="bg-[#FFFFF0] rounded-lg p-6 w-full max-w-2xl border border-[#D9D9D9] shadow-lg relative z-10">
                                <ReviewForm
                                    onClose={() => setShowReviewForm(false)}
                                    initialAlbum={{
                                        id: album.id,
                                        name: album.name,
                                        artist: album.artists
                                            .map((a) => a.name)
                                            .join(", "),
                                        coverArt: album.images[0]?.url,
                                        release_date: album.release_date,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer variant="light" />
        </div>
    );
};

export default AlbumDetailsPage;
