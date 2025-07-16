"use client";

import React, { useState } from "react";
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
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
}

const Songs = () => {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState("Most Rated");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("Genre");
    const [selectedMood, setSelectedMood] = useState("Mood");
    const [selectedYear, setSelectedYear] = useState("Year");
    const [selectedRating, setSelectedRating] = useState("Rating");
    // Mock data
    const tracks: Track[] = [
        {
            id: "1",
            title: "Blinding Lights",
            artist: "The Weeknd",
            album: "After Hours",
            coverArt:
                "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            avgRating: 4.5,
            saveCount: 1247,
            genre: "Pop",
            year: 2020,
            mood: "Energetic",
            isSaved: false,
        },
        {
            id: "2",
            title: "Bohemian Rhapsody",
            artist: "Queen",
            album: "A Night at the Opera",
            coverArt:
                "https://images.unsplash.com/photo-1515552726023-7125c8d07fb3?w=300&h=300&fit=crop",
            avgRating: 4.8,
            saveCount: 2156,
            genre: "Rock",
            year: 1975,
            mood: "Epic",
            isSaved: true,
        },
        {
            id: "3",
            title: "Good 4 U",
            artist: "Olivia Rodrigo",
            album: "Sour",
            coverArt:
                "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
            avgRating: 4.2,
            saveCount: 892,
            genre: "Pop",
            year: 2021,
            mood: "Angry",
            isSaved: false,
        },
        {
            id: "4",
            title: "Heat Waves",
            artist: "Glass Animals",
            album: "Dreamland",
            coverArt:
                "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            avgRating: 4.3,
            saveCount: 1543,
            genre: "Alternative",
            year: 2020,
            mood: "Chill",
            isSaved: true,
        },
        {
            id: "5",
            title: "Levitating",
            artist: "Dua Lipa",
            album: "Future Nostalgia",
            coverArt:
                "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
            avgRating: 4.4,
            saveCount: 1876,
            genre: "Pop",
            year: 2020,
            mood: "Happy",
            isSaved: false,
        },
        {
            id: "6",
            title: "Stay",
            artist: "The Kid LAROI & Justin Bieber",
            album: "F*ck Love 3",
            coverArt:
                "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            avgRating: 4.1,
            saveCount: 967,
            genre: "Hip Hop",
            year: 2021,
            mood: "Romantic",
            isSaved: false,
        },
    ];

    const trendingTracks = tracks.slice(0, 5);

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

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="relative mb-2">
                        <div className="w-4 h-4 text-[#D9D9D9]">★</div>
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

    const TrackCard = ({ track }: { track: Track }) => (
        <div className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div
                className={`p-4 ${
                    viewMode === "list" ? "flex items-center space-x-4" : ""
                }`}>
                <div
                    className={`${
                        viewMode === "list" ? "w-16 h-16" : "w-full h-48"
                    } relative overflow-hidden rounded-lg bg-gray-200`}>
                    <img
                        src={track.coverArt}
                        alt={`${track.title} cover`}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                    />
                </div>

                <div className={`${viewMode === "list" ? "flex-1" : "mt-3"}`}>
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
                            <p className="text-[#A0A0A0] text-sm">
                                {track.artist}
                            </p>
                            <p className="text-[#A0A0A0] text-xs">
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
                            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                                track.isSaved
                                    ? "bg-[#FFBA00] text-[#1F2C24]"
                                    : "bg-[#6D9773] text-[#F9F9F9] hover:bg-[#5C8769]"
                            }`}>
                            <Heart className="w-3 h-3" />
                            <span>{track.isSaved ? "Liked" : "Like"}</span>
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
    );

    return (
        <div className="min-h-screen bg-[#FFFFF0]">
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Search and Filters */}
                <div className="mb-6">
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
                                                className="hover:bg-[#FFFFF0] cursor-pointer"
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
                                                className="hover:bg-[#FFFFF0] cursor-pointer"
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
                                                className="hover:bg-[#FFFFF0] cursor-pointer"
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
                                                className="hover:bg-[#FFFFF0] cursor-pointer"
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
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full h-full pl-10 pr-4 py-3 bg-[#FFFFF0] border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D9773]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trending This Week */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#0C3B2E] mb-6">
                        <span className="text-[#FFBA00]">Trending</span> This
                        Week
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {trendingTracks.map((track) => (
                            <TrackCard
                                key={`trending-${track.id}`}
                                track={track}
                            />
                        ))}
                    </div>
                </div>

                {/* Main Songs Feed */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#0C3B2E] mb-6">
                        All Songs
                    </h2>
                    <div
                        className={`grid gap-6 ${
                            viewMode === "grid"
                                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                                : "grid-cols-1"
                        }`}>
                        {tracks.map((track) => (
                            <TrackCard key={track.id} track={track} />
                        ))}
                    </div>
                </div>

                {/* Load More */}
                <div className="text-center">
                    <button className="px-8 py-3 bg-[#6D9773] text-[#F9F9F9] rounded-lg hover:bg-[#5C8769] transition-colors">
                        Load More Songs
                    </button>
                </div>
            </div>
            <Footer variant="light" />
        </div>
    );
};

export default Songs;
