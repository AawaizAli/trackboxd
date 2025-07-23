"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    Grid,
    List,
    Heart,
    Star,
    MessageCircle,
    Bookmark,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { likeTrack, unlikeTrack, isTrackLiked } from "@/lib/supabase/db-likes";
import { useSession } from "next-auth/react";

interface Track {
    id: string;
    title: string;
    artist: string;
    album: string;
    coverArt: string;
    avgRating: number;
    saveCount: number;
    genre: string;
    year: number;
    mood: string;
    isSaved: boolean;
    isLiked: boolean; // Add this new field
}

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
    added_by?: {
        id: string;
    };
}

interface SpotifyPlaylistTrack {
    track: SpotifyTrack;
}

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

    const { data: session } = useSession();
    const user = session?.user;

    const spotifyToTrack = (spotifyTrack: SpotifyTrack): Track => ({
        id: spotifyTrack.id,
        title: spotifyTrack.name,
        artist: spotifyTrack.artists.map((a) => a.name).join(", "),
        album: spotifyTrack.album.name,
        coverArt: spotifyTrack.album.images[0]?.url || "/default-album.png",
        avgRating: 4.0,
        saveCount: Math.floor(Math.random() * 2000) + 500,
        genre: "Pop",
        year: parseInt(spotifyTrack.album.release_date.substring(0, 4)) || 2023,
        mood: "Energetic",
        isSaved: false,
        isLiked: false, // Initialize as false
    });

    const handleLike = async (trackId: string) => {
        try {
            const result = await likeTrack(user.id, trackId);
            if (result.success) {
                // Update the UI state
                setGlobalTopTracks((prevTracks) =>
                    prevTracks.map((track) =>
                        track.id === trackId
                            ? { ...track, isLiked: true }
                            : track
                    )
                );
                // You might want to show a success toast here
            } else {
                // Show error message
                console.error(result.message);
            }
        } catch (error) {
            console.error("Error liking track:", error);
        }
    };

    // Add this function to check like status
    const checkLikeStatus = async (trackId: string) => {
        try {
            const isLiked = await isTrackLiked(user.id, trackId);
            return isLiked;
        } catch (error) {
            console.error("Error checking like status:", error);
            return false;
        }
    };

    useEffect(() => {
        const fetchGlobalTopTracks = async () => {
            try {
                const res = await fetch("/api/songs/global-top-4");
                if (!res.ok)
                    throw new Error("Failed to fetch global top tracks");
                const data = await res.json();
                const tracks = data.map(
                    (item: SpotifyPlaylistTrack) => item.track
                );

                // Check like status for each track
                const tracksWithLikeStatus = await Promise.all(
                    tracks.map(async (track: SpotifyTrack) => {
                        const isLiked = await checkLikeStatus(track.id);
                        return {
                            ...spotifyToTrack(track),
                            isLiked,
                        };
                    })
                );

                setGlobalTopTracks(tracksWithLikeStatus);
            } catch (error) {
                console.error("Error fetching global top tracks:", error);
                setTopTracksError("Failed to load global top tracks");
            } finally {
                setIsLoadingTopTracks(false);
            }
        };

        fetchGlobalTopTracks();
    }, [user?.id]);

    const reviews: Review[] = [
        {
            id: "r1",
            user: "Sarah Johnson",
            rating: 5.0,
            content:
                "This album changed my life! Every track is a masterpiece.",
            timestamp: "2 days ago",
            likes: 42,
        },
        {
            id: "r2",
            user: "Mike Rodriguez",
            rating: 4.5,
            content:
                "The production quality is insane. Best album of the year!",
            timestamp: "1 day ago",
            likes: 31,
        },
        {
            id: "r3",
            user: "Emma Davis",
            rating: 4.0,
            content: "Solid album with a few standout tracks. Worth a listen.",
            timestamp: "3 days ago",
            likes: 28,
        },
        {
            id: "r4",
            user: "Jordan Kim",
            rating: 4.8,
            content: "Perfect blend of nostalgia and innovation. Brilliant!",
            timestamp: "1 day ago",
            likes: 37,
        },
        {
            id: "r5",
            user: "Alex Turner",
            rating: 3.5,
            content: "Good but not their best work. Some tracks feel filler.",
            timestamp: "4 days ago",
            likes: 19,
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

    const trendingTracks =
        globalTopTracks.length > 0
            ? globalTopTracks.slice(0, 4).map(spotifyToTrack)
            : [];

    const recentlyReviewed =
        globalTopTracks.length > 0
            ? globalTopTracks.slice(0, 4).map(spotifyToTrack)
            : [];

    const recentlyAnnotated =
        globalTopTracks.length > 0
            ? globalTopTracks.slice(2, 6).map(spotifyToTrack)
            : [];

    const genres = [
        "All",
        "Pop",
        "Rock",
        "Hip Hop",
        "Alternative",
        "Electronic",
    ];
    const moods = [
        "All",
        "Happy",
        "Sad",
        "Energetic",
        "Chill",
        "Angry",
        "Romantic",
        "Epic",
    ];
    const years = [
        "All",
        "2023",
        "2022",
        "2021",
        "2020",
        "2019",
        "2018",
        "2017",
        "2016",
        "2015",
    ];

    useEffect(() => {
        const fetchGlobalTopTracks = async () => {
            try {
                const res = await fetch("/api/songs/global-top-4");
                if (!res.ok) {
                    throw new Error("Failed to fetch global top tracks");
                }
                const data = await res.json();

                // Extract the track objects from the playlist items
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

    // Full track card with truncated artist and album names
    const TrackCard = ({ track }: { track: Track }) => {
        const [isLiked, setIsLiked] = useState(track.isLiked);
        const [isProcessing, setIsProcessing] = useState(false);

        const handleLikeClick = async (e: React.MouseEvent) => {
            e.preventDefault(); // Prevent navigation when clicking like button
            e.stopPropagation();

            if (isProcessing) return;
            setIsProcessing(true);

            try {
                if (isLiked) {
                    const result = await unlikeTrack(user.id, track.id);
                    if (result.success) {
                        setIsLiked(false);
                        // Update the save count in the UI
                        track.saveCount = Math.max(0, track.saveCount - 1);
                    }
                } else {
                    const result = await likeTrack(user.id, track.id);
                    if (result.success) {
                        setIsLiked(true);
                        // Update the save count in the UI
                        track.saveCount += 1;
                    }
                }
            } catch (error) {
                console.error("Error toggling like:", error);
            } finally {
                setIsProcessing(false);
            }
        };

        return (
            <Link href={`/songs/${track.id}`}>
                <div className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div
                        className={`p-4 ${
                            viewMode === "list"
                                ? "flex items-center space-x-4"
                                : ""
                        }`}>
                        <div
                            className={`${
                                viewMode === "list"
                                    ? "w-16 h-16"
                                    : "w-full h-48"
                            } relative overflow-hidden rounded-lg bg-gray-200`}>
                            <img
                                src={track.coverArt}
                                alt={`${track.title} cover`}
                                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                            />
                        </div>

                        <div
                            className={`${
                                viewMode === "list" ? "flex-1" : "mt-3"
                            }`}>
                            <div
                                className={`${
                                    viewMode === "list"
                                        ? "flex items-center justify-between"
                                        : ""
                                }`}>
                                <div
                                    className={`${
                                        viewMode === "list" ? "flex-1" : ""
                                    }`}>
                                    <h3 className="font-semibold text-[#1F2C24] cursor-pointer hover:text-[#6D9773] transition-colors">
                                        {track.title}
                                    </h3>
                                    <p className="text-[#A0A0A0] text-sm truncate">
                                        {track.artist}
                                    </p>
                                    <p className="text-[#A0A0A0] text-xs truncate">
                                        {track.album}
                                    </p>
                                </div>

                                <div
                                    className={`${
                                        viewMode === "list"
                                            ? "flex items-center space-x-6"
                                            : "mt-2"
                                    }`}>
                                    {renderStars(track.avgRating)}
                                    <div className="flex items-center space-x-1 text-[#A0A0A0]">
                                        <Heart className="w-4 h-4" />
                                        <span className="text-sm">
                                            {track.saveCount}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`${
                                    viewMode === "list" ? "mt-2" : "mt-3"
                                } flex flex-wrap gap-2`}>
                                <button
                                    onClick={handleLikeClick}
                                    disabled={isProcessing}
                                    className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                                        isLiked
                                            ? "bg-[#FFBA00] text-[#1F2C24]"
                                            : "bg-[#6D9773] text-[#F9F9F9] hover:bg-[#5C8769]"
                                    }`}>
                                    <Heart className="w-3 h-3" />
                                    <span>{isLiked ? "Liked" : "Like"}</span>
                                    {isProcessing && (
                                        <span className="ml-1">
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                        </span>
                                    )}
                                </button>
                                <button className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm bg-[#FFFFF0] text-[#1F2C24] border border-[#D9D9D9] hover:bg-[#E2E3DF] transition-colors">
                                    <Star className="w-3 h-3" />
                                    <span>Review</span>
                                </button>
                                <button className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm bg-[#FFFFF0] text-[#1F2C24] border border-[#D9D9D9] hover:bg-[#E2E3DF] transition-colors">
                                    <MessageCircle className="w-3 h-3" />
                                    <span>Annotate</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    };

    // Spotify track card with truncated artist and album names
    const SpotifyTrackCard = ({ track }: { track: SpotifyTrack }) => {
        const [isLiked, setIsLiked] = useState(false);
        const [isProcessing, setIsProcessing] = useState(false);

        useEffect(() => {
            const checkLike = async () => {
                const liked = await checkLikeStatus(track.id);
                setIsLiked(liked);
            };
            checkLike();
        }, [track.id]);

        const handleLikeClick = async (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (isProcessing) return;
            setIsProcessing(true);

            try {
                if (isLiked) {
                    await unlikeTrack(user.id, track.id);
                    setIsLiked(false);
                } else {
                    await likeTrack(user.id, track.id);
                    setIsLiked(true);
                }
            } catch (error) {
                console.error("Error toggling like:", error);
            } finally {
                setIsProcessing(false);
            }
        };

        return (
            <Link href={`/songs/${track.id}`}>
                <div className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="p-4">
                        <div className="w-full h-48 relative overflow-hidden rounded-lg bg-gray-200">
                            <img
                                src={
                                    track.album.images[0]?.url ||
                                    "/default-album.png"
                                }
                                alt={`${track.name} cover`}
                                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                            />
                        </div>

                        <div className="mt-3">
                            <div>
                                <h3 className="font-semibold text-[#1F2C24] cursor-pointer hover:text-[#6D9773] transition-colors">
                                    {track.name}
                                </h3>
                                <p className="text-[#A0A0A0] text-sm truncate">
                                    {track.artists
                                        .map((a) => a.name)
                                        .join(", ")}
                                </p>
                                <p className="text-[#A0A0A0] text-xs truncate">
                                    {track.album.name}
                                </p>
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                    onClick={handleLikeClick}
                                    disabled={isProcessing}
                                    className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                                        isLiked
                                            ? "bg-[#FFBA00] text-[#1F2C24]"
                                            : "bg-[#6D9773] text-[#F9F9F9] hover:bg-[#5C8769]"
                                    }`}>
                                    <Heart className="w-3 h-3" />
                                    <span>
                                        {isLiked ? "Liked" : "Like"}
                                    </span>
                                    {isProcessing && (
                                        <span className="ml-1">
                                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                        </span>
                                    )}
                                </button>
                                <button className="flex items-center space-x-1 px-3 py-1 rounded-full text-sm bg-[#FFFFF0] text-[#1F2C24] border border-[#D9D9D9] hover:bg-[#E2E3DF] transition-colors">
                                    <Star className="w-3 h-3" />
                                    <span>Review</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    };

    // Compact track card for recently reviewed/annotated with truncated artist name
    const CompactTrackCard = ({ track }: { track: Track }) => (
        <Link href={`/songs/${track.id}`}>
            <div className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center space-x-3 p-3">
                    <div className="w-16 h-16 relative overflow-hidden rounded-lg bg-gray-200 flex-shrink-0">
                        <img
                            src={track.coverArt}
                            alt={`${track.title} cover`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-medium text-[#1F2C24] truncate">
                            {track.title}
                        </h3>
                        <p className="text-[#A0A0A0] text-sm truncate">
                            {track.artist}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );

    // Review card for popular reviews
    const ReviewCard = ({ review }: { review: Review }) => (
        <div className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="font-medium text-[#1F2C24]">
                            {review.user}
                        </div>
                        {renderStars(review.rating)}
                    </div>
                    <p className="text-[#1F2C24] line-clamp-2 mb-2">
                        {review.content}
                    </p>
                </div>
                <div className="flex items-center space-x-1 text-[#A0A0A0]">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{review.likes}</span>
                </div>
            </div>
            <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-[#A0A0A0]">
                    {review.timestamp}
                </span>
                <button className="text-xs text-[#6D9773] hover:text-[#5C8769]">
                    Read full review
                </button>
            </div>
        </div>
    );

    // Annotation card for popular annotations
    const AnnotationCard = ({ annotation }: { annotation: Annotation }) => (
        <div className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-lg p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start">
                <div>
                    <div className="font-medium text-[#1F2C24] mb-2">
                        {annotation.user}
                    </div>
                    <p className="text-[#1F2C24] line-clamp-2 mb-2">
                        {annotation.content}
                    </p>
                </div>
                <div className="flex items-center space-x-1 text-[#A0A0A0]">
                    <Heart className="w-4 h-4" />
                    <span className="text-sm">{annotation.likes}</span>
                </div>
            </div>
            <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-[#A0A0A0]">
                    {annotation.timestamp}
                </span>
                <button className="text-xs text-[#6D9773] hover:text-[#5C8769]">
                    View annotation
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FFFFF0]">
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Search and Filters */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row gap-3 items-stretch">
                        {/* Filters - Left-aligned */}
                        <div className="flex flex-wrap gap-3 flex-1">
                            {/* Genre Filter */}
                            <div className="relative flex-1 min-w-[150px]">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="w-full h-full pl-10 pr-4 py-2 bg-[#FFFFF0] border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D9773] text-left flex items-center">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-[#A0A0A0]"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                                />
                                            </svg>
                                        </div>
                                        <span className="truncate">
                                            {selectedGenre || "Genre"}
                                        </span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="max-h-60 overflow-y-auto bg-[#FFFFF0] border border-[#D9D9D9]">
                                        {genres.map((genre) => (
                                            <DropdownMenuItem
                                                key={genre}
                                                className="hover:bg-[#F2F3EF] cursor-pointer"
                                                onSelect={() =>
                                                    setSelectedGenre(genre)
                                                }>
                                                {genre}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Mood Filter */}
                            <div className="relative flex-1 min-w-[150px]">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="w-full h-full pl-10 pr-4 py-2 bg-[#FFFFF0] border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D9773] text-left flex items-center">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-[#A0A0A0]"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <span className="truncate">
                                            {selectedMood || "Mood"}
                                        </span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="max-h-60 overflow-y-auto bg-[#FFFFF0] border border-[#D9D9D9]">
                                        {moods.map((mood) => (
                                            <DropdownMenuItem
                                                key={mood}
                                                className="hover:bg-[#F2F3EF] cursor-pointer"
                                                onSelect={() =>
                                                    setSelectedMood(mood)
                                                }>
                                                {mood}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Year Filter */}
                            <div className="relative flex-1 min-w-[120px]">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="w-full h-full pl-10 pr-4 py-2 bg-[#FFFFF0] border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D9773] text-left flex items-center">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 text-[#A0A0A0]"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <span className="truncate">
                                            {selectedYear || "Year"}
                                        </span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="max-h-60 overflow-y-auto bg-[#FFFFF0] border border-[#D9D9D9]">
                                        {years.map((year) => (
                                            <DropdownMenuItem
                                                key={year}
                                                className="hover:bg-[#F2F3EF] cursor-pointer"
                                                onSelect={() =>
                                                    setSelectedYear(year)
                                                }>
                                                {year}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Rating Filter */}
                            <div className="relative flex-1 min-w-[150px]">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="w-full h-full pl-10 pr-4 py-2 bg-[#FFFFF0] border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D9773] text-left flex items-center">
                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                            <Star className="h-4 w-4 text-[#A0A0A0]" />
                                        </div>
                                        <span className="truncate">
                                            {selectedRating || "Rating"}
                                        </span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-[#FFFFF0] border border-[#D9D9D9]">
                                        {[
                                            "All Ratings",
                                            "4+ Stars",
                                            "3+ Stars",
                                            "2+ Stars",
                                        ].map((rating) => (
                                            <DropdownMenuItem
                                                key={rating}
                                                className="hover:bg-[#F2F3EF] cursor-pointer"
                                                onSelect={() =>
                                                    setSelectedRating(rating)
                                                }>
                                                {rating}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Search - Right-aligned */}
                        <div className="w-full lg:w-[320px]">
                            <div className="relative h-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search tracks, artists, albums..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        searchSpotify(e.target.value);
                                    }}
                                    className="w-full h-full pl-10 pr-4 py-3 bg-[#FFFFF0] border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D9773]"
                                />
                                {isSearching && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#6D9773]"></div>
                                    </div>
                                )}
                            </div>
                            {searchError && (
                                <p className="text-red-500 text-sm mt-1">
                                    {searchError}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

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
                                <div className="grid grid-cols-2 gap-4">
                                    {recentlyReviewed.map((track) => (
                                        <CompactTrackCard
                                            key={`reviewed-${track.id}`}
                                            track={track}
                                        />
                                    ))}
                                </div>
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
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <ReviewCard
                                        key={review.id}
                                        review={review}
                                    />
                                ))}
                            </div>
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
                    </>
                )}
            </div>
            <Footer variant="light" />
        </div>
    );
};

export default Songs;
