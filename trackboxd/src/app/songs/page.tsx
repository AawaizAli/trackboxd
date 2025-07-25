"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import useUser from "@/hooks/useUser";
import AnnotationForm from "@/components/log/forms/AnnotationForm";
import ReviewForm from "@/components/log/forms/ReviewForm";

import Filters from "@/components/songs/Filters";
import TrackCard from "@/components/songs/TrackCard";
import SpotifyTrackCard from "@/components/songs/SpotifyTrackCard";
import CompactTrackCard from "@/components/songs/CompactTrackCard";
import ReviewCard from "@/components/songs/ReviewCard";
import AnnotationCard from "@/components/songs/AnnotationCard";
import { spotifyToTrack, reviewToTrack } from "@/utils/trackConverters";

import {
    Track,
    SpotifyTrack,
    Review,
    Annotation,
    SpotifyPlaylistTrack,
} from "./types";

const annotations: Annotation[] = [
    {
        id: "a1",
        user: "Taylor Swift",
        content: "The bridge at 2:45 gives me chills every time! Pure emotion.",
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
        content: "The vocal harmonies at 1:30 are everything! Queen behavior.",
        timestamp: "3 days ago",
        likes: 41,
    },
    {
        id: "a4",
        user: "Bruno Mars",
        content: "The bassline at 0:45 is so funky! Can't stop grooving.",
        timestamp: "1 day ago",
        likes: 27,
    },
    {
        id: "a5",
        user: "Adele",
        content: "The lyrics at 4:10 hit me right in the feels. So raw!",
        timestamp: "2 days ago",
        likes: 35,
    },
];

const Songs = () => {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState("Most Rated");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("Genre");
    const [selectedMood, setSelectedMood] = useState("Mood");
    const [selectedYear, setSelectedYear] = useState("Year");
    const [selectedRating, setSelectedRating] = useState("Rating");
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<SpotifyTrack[]>([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [globalTopTracks, setGlobalTopTracks] = useState<SpotifyTrack[]>([]);
    const [isLoadingTopTracks, setIsLoadingTopTracks] = useState(true);
    const [topTracksError, setTopTracksError] = useState<string | null>(null);
    const [likes, setLikes] = useState<Record<string, boolean>>({});
    const [isLoadingLikes, setIsLoadingLikes] = useState<
        Record<string, boolean>
    >({});
    const [fetchedTracks, setFetchedTracks] = useState<Set<string>>(new Set());
    const [showAnnotationForm, setShowAnnotationForm] = useState(false);
    const [annotationTrack, setAnnotationTrack] = useState<Track | null>(null);
    const { user, loading: userLoading, error: userError } = useUser();

    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewTrack, setReviewTrack] = useState<Track | null>(null);

    const [recentlyReviewedTracks, setRecentlyReviewedTracks] = useState<
        Review[]
    >([]);
    const [isLoadingRecentlyReviewed, setIsLoadingRecentlyReviewed] =
        useState(false);
    const [recentlyReviewedError, setRecentlyReviewedError] = useState<
        string | null
    >(null);

    const [popularReviews, setPopularReviews] = useState<Review[]>([]);
    const [isLoadingPopularReviews, setIsLoadingPopularReviews] =
        useState(false);
    const [popularReviewsError, setPopularReviewsError] = useState<
        string | null
    >(null);

    const fetchPopularReviews = async () => {
        setIsLoadingPopularReviews(true);
        setPopularReviewsError(null);

        try {
            const res = await fetch("/api/review/popular-this-week");
            if (!res.ok) {
                throw new Error("Failed to fetch popular reviews");
            }
            const data = await res.json();
            setPopularReviews(data);
            console.log("Popular reviews:", data);
        } catch (error) {
            console.error("Error fetching popular reviews:", error);
            setPopularReviewsError("Failed to load popular reviews");
        } finally {
            setIsLoadingPopularReviews(false);
        }
    };

    useEffect(() => {
        if (!showSearchResults) {
            fetchPopularReviews();
        }
    }, [showSearchResults]);

    const fetchRecentlyReviewedTracks = async () => {
        setIsLoadingRecentlyReviewed(true);
        setRecentlyReviewedError(null);

        try {
            const res = await fetch("/api/review/last-reviewed-tracks");
            if (!res.ok) {
                throw new Error("Failed to fetch recently reviewed tracks");
            }
            const data = await res.json();
            setRecentlyReviewedTracks(data);
            console.log("Recently reviewed tracks:", data);
        } catch (error) {
            console.error("Error fetching recently reviewed tracks:", error);
            setRecentlyReviewedError("Failed to load recently reviewed tracks");
        } finally {
            setIsLoadingRecentlyReviewed(false);
        }
    };

    useEffect(() => {
        fetchRecentlyReviewedTracks();
    }, []);

    const handleLikeClick = async (trackId: string) => {
        if (!user) {
            // Redirect to landing page if not logged in
            window.location.href = "/";
            return;
        }

        setIsLoadingLikes((prev) => ({ ...prev, [trackId]: true }));

        try {
            const currentLikedStatus = likes[trackId] || false;
            const method = currentLikedStatus ? "DELETE" : "POST";
            const endpoint = `/api/like/track`;

            const response = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, trackId }),
            });

            if (!response.ok) {
                throw new Error("Failed to update like status");
            }

            setLikes((prev) => ({ ...prev, [trackId]: !currentLikedStatus }));
        } catch (error) {
            console.error("Like operation failed:", error);
        } finally {
            setIsLoadingLikes((prev) => ({ ...prev, [trackId]: false }));
        }
    };

    const trendingTracks =
        globalTopTracks.length > 0
            ? globalTopTracks.slice(0, 4).map(spotifyToTrack)
            : [];

    const recentlyAnnotated =
        globalTopTracks.length > 0
            ? globalTopTracks.slice(2, 6).map(spotifyToTrack)
            : [];

    const fetchLikeStatuses = async (trackIds: string[]) => {
        if (!user) return;

        try {
            const tracksToFetch = trackIds.filter(
                (id) => !fetchedTracks.has(id)
            );
            if (tracksToFetch.length === 0) return;

            setFetchedTracks((prev) => {
                const newSet = new Set(prev);
                tracksToFetch.forEach((id) => newSet.add(id));
                return newSet;
            });

            const likeStatuses = await Promise.all(
                tracksToFetch.map((trackId) =>
                    fetch(
                        `/api/like/track?userId=${user.id}&trackId=${trackId}`
                    )
                        .then((res) => res.json())
                        .then((data) => ({ trackId, isLiked: data.isLiked }))
                )
            );

            setLikes((prev) => {
                const newLikes = { ...prev };
                likeStatuses.forEach(({ trackId, isLiked }) => {
                    newLikes[trackId] = isLiked;
                });
                return newLikes;
            });
        } catch (error) {
            console.error("Failed to fetch like statuses:", error);
        }
    };

    useEffect(() => {
        const fetchGlobalTopTracks = async () => {
            try {
                const res = await fetch("/api/songs/global-top-4");
                if (!res.ok) {
                    throw new Error("Failed to fetch global top tracks");
                }
                const data = await res.json();
                const tracks = data.map(
                    (item: SpotifyPlaylistTrack) => item.track
                );
                setGlobalTopTracks(tracks);
                console.log("Global top tracks:", tracks);
            } catch (error) {
                console.error("Error fetching global top tracks:", error);
                setTopTracksError("Failed to load global top tracks");
            } finally {
                setIsLoadingTopTracks(false);
            }
        };

        fetchGlobalTopTracks();
    }, []);

    useEffect(() => {
        if (user && globalTopTracks.length > 0) {
            const trackIds = globalTopTracks.map((t) => t.id);
            fetchLikeStatuses(trackIds);
        }
    }, [user, globalTopTracks]);

    useEffect(() => {
        if (user && searchResults.length > 0) {
            const trackIds = searchResults.map((t) => t.id);
            fetchLikeStatuses(trackIds);
        }
    }, [user, searchResults]);

    useEffect(() => {
        if (!user) {
            setLikes({});
            setFetchedTracks(new Set());
        }
    }, [user]);

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
                <span className="text-sm text-[#1F2C24] ml-1">{rating}</span>
            </div>
        );
    };

    const searchSpotify = async (query: string) => {
        if (!query) {
            setSearchError(null);
            setShowSearchResults(false);
            return;
        }

        setIsSearching(true);
        setSearchError(null);

        try {
            const res = await fetch(
                `/api/songs/search?q=${encodeURIComponent(query)}`
            );
            if (!res.ok) {
                throw new Error("Failed to search");
            }
            const data = await res.json();
            setSearchResults(data.tracks?.items || []);
            setShowSearchResults(true);
        } catch (error) {
            console.error("Spotify search error:", error);
            setSearchError("Failed to search. Please try again.");
            setShowSearchResults(false);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFFF0]">
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Search and Filters */}

                <Filters
                    selectedGenre={selectedGenre}
                    setSelectedGenre={setSelectedGenre}
                    selectedMood={selectedMood}
                    setSelectedMood={setSelectedMood}
                    selectedYear={selectedYear}
                    setSelectedYear={setSelectedYear}
                    selectedRating={selectedRating}
                    setSelectedRating={setSelectedRating}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    isSearching={isSearching}
                    searchError={searchError}
                    searchSpotify={searchSpotify}
                />

                {/* Search Results */}
                {showSearchResults && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#0C3B2E]">
                                Search Results for{" "}
                                <span className="text-[#6D9773]">
                                    "{searchTerm}"
                                </span>
                            </h2>
                            <button
                                onClick={() => setShowSearchResults(false)}
                                className="text-sm text-[#6D9773] hover:text-[#5C8769]">
                                Clear results
                            </button>
                        </div>
                        {searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                {searchResults.map((track) => (
                                    <SpotifyTrackCard
                                        key={`spotify-${track.id}`}
                                        track={track}
                                        isLiked={likes[track.id] || false}
                                        isLoading={
                                            isLoadingLikes[track.id] || false
                                        }
                                        onLikeClick={handleLikeClick}
                                        onReviewClick={(track) => {
                                            setReviewTrack(
                                                spotifyToTrack(track)
                                            );
                                            setShowReviewForm(true);
                                        }}
                                        onAnnotationClick={(track) => {
                                            setAnnotationTrack(
                                                spotifyToTrack(track)
                                            );
                                            setShowAnnotationForm(true);
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-[#A0A0A0]">No results found</p>
                        )}
                    </div>
                )}

                {/* Trending This Week - 4 songs only */}
                {!showSearchResults && (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-[#0C3B2E] mb-6">
                                <span className="text-[#FFBA00]">Trending</span>{" "}
                                This Week
                            </h2>
                            {isLoadingTopTracks ? (
                                <div className="flex justify-center items-center h-48">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6D9773]"></div>
                                </div>
                            ) : topTracksError ? (
                                <p className="text-red-500">{topTracksError}</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                    {trendingTracks.map((track) => (
                                        <TrackCard
                                            key={`trending-${track.id}`}
                                            track={track}
                                            viewMode={viewMode}
                                            isLiked={likes[track.id] || false}
                                            isLoading={
                                                isLoadingLikes[track.id] ||
                                                false
                                            }
                                            onLikeClick={handleLikeClick}
                                            onReviewClick={(track) => {
                                                setReviewTrack(track);
                                                setShowReviewForm(true);
                                            }}
                                            onAnnotationClick={(track) => {
                                                setAnnotationTrack(track);
                                                setShowAnnotationForm(true);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recently Reviewed & Annotated - Side by side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Recently Reviewed */}
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-[#0C3B2E]">
                                        Recently Reviewed
                                    </h2>
                                </div>
                                {isLoadingRecentlyReviewed ? (
                                    <div className="flex justify-center items-center h-32">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6D9773]"></div>
                                    </div>
                                ) : recentlyReviewedError ? (
                                    <p className="text-red-500">
                                        {recentlyReviewedError}
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {recentlyReviewedTracks.map(
                                            (review) => {
                                                const track =
                                                    reviewToTrack(review);
                                                return (
                                                    <div
                                                        key={review.id}
                                                        className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-16 h-16 relative overflow-hidden rounded-lg bg-gray-200 flex-shrink-0">
                                                                <img
                                                                    src={
                                                                        track.coverArt
                                                                    }
                                                                    alt={`${track.title} cover`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <div className="font-medium text-[#1F2C24]">
                                                                        {
                                                                            review
                                                                                .users
                                                                                .name
                                                                        }
                                                                    </div>
                                                                    {renderStars(
                                                                        review.rating
                                                                    )}
                                                                </div>
                                                                <h3 className="font-semibold text-[#1F2C24]">
                                                                    {
                                                                        track.title
                                                                    }
                                                                </h3>
                                                                <p className="text-[#A0A0A0] text-sm truncate">
                                                                    {
                                                                        track.artist
                                                                    }
                                                                </p>
                                                                {review.text && (
                                                                    <p className="text-[#1F2C24] text-sm mt-2 line-clamp-2">
                                                                        {
                                                                            review.text
                                                                        }
                                                                    </p>
                                                                )}
                                                                <div className="flex justify-between items-center mt-2">
                                                                    <span className="text-xs text-[#A0A0A0]">
                                                                        {new Date(
                                                                            review.created_at
                                                                        ).toLocaleDateString()}
                                                                    </span>
                                                                    <Link
                                                                        href={`/songs/${track.id}`}
                                                                        className="text-xs text-[#6D9773] hover:text-[#5C8769]">
                                                                        View
                                                                        track
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Recently Annotated */}
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-[#0C3B2E]">
                                        Recently Annotated
                                    </h2>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {recentlyAnnotated.map((track) => (
                                        <CompactTrackCard
                                            key={`annotated-${track.id}`}
                                            track={track}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Popular Reviews This Week */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-[#0C3B2E]">
                                    Popular Reviews This Week
                                </h2>
                            </div>

                            {isLoadingPopularReviews ? (
                                <div className="flex justify-center items-center h-32">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6D9773]"></div>
                                </div>
                            ) : popularReviewsError ? (
                                <p className="text-red-500">
                                    {popularReviewsError}
                                </p>
                            ) : popularReviews.length > 0 ? (
                                <div className="space-y-4">
                                    {popularReviews.map((review) => (
                                        <ReviewCard
                                            key={review.id}
                                            review={review}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[#A0A0A0]">
                                    No popular reviews yet
                                </p>
                            )}
                        </div>

                        {/* Popular Annotations This Week */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-[#0C3B2E]">
                                    Popular Annotations This Week
                                </h2>
                            </div>
                            <div className="space-y-4">
                                {annotations.map((annotation) => (
                                    <AnnotationCard
                                        key={annotation.id}
                                        annotation={annotation}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Review Form Popup */}
                        {showReviewForm && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center">
                                {/* Darkened background overlay */}
                                <div
                                    className="absolute inset-0 bg-black/50 bg-opacity-20"
                                    onClick={() =>
                                        setShowReviewForm(false)
                                    }></div>

                                {/* Popup container */}
                                <div className="bg-[#FFFFF0] rounded-lg p-6 w-full max-w-2xl border border-[#D9D9D9] shadow-lg relative z-10">
                                    {/* Review Form */}
                                    <ReviewForm
                                        onClose={() => {
                                            setShowReviewForm(false);
                                            setReviewTrack(null);
                                        }}
                                        initialTrack={
                                            reviewTrack
                                                ? {
                                                      id: reviewTrack.id,
                                                      name: reviewTrack.title,
                                                      artist: reviewTrack.artist,
                                                      album: reviewTrack.album,
                                                      coverArt:
                                                          reviewTrack.coverArt,
                                                  }
                                                : undefined
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        {/* Annotation Form Popup */}
                        {showAnnotationForm && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center">
                                {/* Darkened background overlay */}
                                <div
                                    className="absolute inset-0 bg-black/50 bg-opacity-20"
                                    onClick={() =>
                                        setShowAnnotationForm(false)
                                    }></div>

                                {/* Popup container */}
                                <div className="bg-[#FFFFF0] rounded-lg p-6 w-full max-w-2xl border border-[#D9D9D9] shadow-lg relative z-10">
                                    {/* Annotation Form */}
                                    <AnnotationForm
                                        onClose={() => {
                                            setShowAnnotationForm(false);
                                            setAnnotationTrack(null);
                                        }}
                                        initialTrack={
                                            annotationTrack
                                                ? {
                                                      id: annotationTrack.id,
                                                      name: annotationTrack.title,
                                                      artist: annotationTrack.artist,
                                                      album: annotationTrack.album,
                                                      coverArt:
                                                          annotationTrack.coverArt,
                                                  }
                                                : undefined
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer variant="light" />
        </div>
    );
};

export default Songs;
