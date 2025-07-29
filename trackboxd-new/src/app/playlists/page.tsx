"use client";

import React, { useState, useEffect } from "react";
import { Search, Grid, List, Heart, Star, Plus, X } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import useUser from "@/hooks/useUser";
import { useCallback } from "react";

import { PlaylistCard } from "@/components/playlists/PlaylistCard";
import { PlaylistListItem } from "@/components/playlists/PlaylistListItem";
import CreatePlaylistModal from "@/components/playlists/CreatePlaylistModal"; // Import the modal

interface Playlist {
    id: string;
    name: string; // Changed from title
    creator: string;
    cover_url: string; // Changed from coverArt
    like_count: number; // Changed from likeCount
    tracks: number;
    description: string;
    liked_at?: string;
    weekly_likes?: number;
}

const Playlists = () => {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSort, setSelectedSort] = useState("Most Popular");
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [popularPlaylists, setPopularPlaylists] = useState<Playlist[]>([]);
    const [recentlyLikedPlaylists, setRecentlyLikedPlaylists] = useState<
        Playlist[]
    >([]);
    const [showCreateModal, setShowCreateModal] = useState(false); // State for modal visibility

    const [likes, setLikes] = useState<Record<string, boolean>>({});
    const [isLoadingLikes, setIsLoadingLikes] = useState<
        Record<string, boolean>
    >({});
    const { user } = useUser(); // Add useUser hook

    const fetchLikeStatuses = useCallback(
        async (playlistIds: string[]) => {
            if (!user) return;

            try {
                const likeStatuses = await Promise.all(
                    playlistIds.map((id) =>
                        fetch(
                            `/api/like/playlist?userId=${user.id}&playlistId=${id}`
                        )
                            .then((res) => res.json())
                            .then((data) => ({ id, isLiked: data.isLiked }))
                            .catch(() => ({ id, isLiked: false }))
                    )
                );

                setLikes((prev) => {
                    const newLikes = { ...prev };
                    likeStatuses.forEach(({ id, isLiked }) => {
                        newLikes[id] = isLiked;
                    });
                    return newLikes;
                });
            } catch (error) {
                console.error("Failed to fetch like statuses:", error);
            }
        },
        [user]
    );

    const toggleLike = (id: string) => {
        // Update popular playlists
        setPopularPlaylists((prev) =>
            prev.map((playlist) =>
                playlist.id === id
                    ? { ...playlist, isLiked: !playlist.isLiked }
                    : playlist
            )
        );

        // Update recently liked playlists
        setRecentlyLikedPlaylists((prev) =>
            prev.map((playlist) =>
                playlist.id === id
                    ? { ...playlist, isLiked: !playlist.isLiked }
                    : playlist
            )
        );

        // Update search results
        setSearchResults((prev) =>
            prev.map((playlist) =>
                playlist.id === id
                    ? { ...playlist, isLiked: !playlist.isLiked }
                    : playlist
            )
        );
    };

    const transformPlaylist = (data: any): Playlist => {
        // Common properties
        const base = {
            id: data.id,
            name: data.name || "Untitled Playlist",
            description: data.description || "",
            creator: data.creator || data.owner?.display_name || "Unknown",
            tracks: data.tracks?.total || data.tracks || 0,
            like_count: data.like_count || 0,
        };
    
        // Handle Spotify API responses
        if (data.images) {
            return {
                ...base,
                cover_url: data.images[0]?.url || "/default-playlist.jpg",
                liked_at: data.liked_at,
                weekly_likes: data.weekly_likes,
            };
        }
        
        // Handle our database responses
        return {
            ...base,
            cover_url: data.cover_url || "/default-playlist.jpg",
            liked_at: data.liked_at,
            weekly_likes: data.weekly_likes,
        };
    };

    const handleLikeClick = async (playlistId: string) => {
        if (!user) {
            window.location.href = "/";
            return;
        }

        setIsLoadingLikes((prev) => ({ ...prev, [playlistId]: true }));
        const currentLikedStatus = likes[playlistId] || false;

        try {
            const method = currentLikedStatus ? "DELETE" : "POST";
            const response = await fetch("/api/like/playlist", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, playlistId }),
            });

            if (!response.ok) throw new Error("Failed to update like");

            // Update UI optimistically
            setLikes((prev) => ({
                ...prev,
                [playlistId]: !currentLikedStatus,
            }));

            // Update counts in playlists
            const updateCount = (prev: Playlist[]) =>
                prev.map((p) =>
                    p.id === playlistId
                        ? {
                              ...p,
                              likeCount: currentLikedStatus
                                  ? p.likeCount - 1
                                  : p.likeCount + 1,
                          }
                        : p
                );

            setPopularPlaylists(updateCount);
            setRecentlyLikedPlaylists(updateCount);
            setSearchResults((prev) => updateCount(prev));
        } catch (error) {
            console.error("Like operation failed:", error);
        } finally {
            setIsLoadingLikes((prev) => ({ ...prev, [playlistId]: false }));
        }
    };

    // Fetch initial playlists
    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                // Fetch popular playlists
                const popularRes = await fetch("/api/playlists/popular");
                const popularData = await popularRes.json();
                
                // Transform to unified format
                const transformedPopular = Array.isArray(popularData) 
                    ? popularData.map(transformPlaylist) 
                    : [];
                
                setPopularPlaylists(transformedPopular);
                console.log("Popular playlists:", transformedPopular);

                // Fetch recently liked
                const recentRes = await fetch("/api/playlists/recently-liked");
                const recentData = await recentRes.json();
                
                // Transform to unified format
                const transformedRecent = Array.isArray(recentData) 
                    ? recentData.map(transformPlaylist) 
                    : [];
                
                setRecentlyLikedPlaylists(transformedRecent);
                console.log("Recently liked playlists:", transformedRecent);

                // Fetch likes for both
                const allIds = [
                    ...transformedPopular.map(p => p.id),
                    ...transformedRecent.map(p => p.id),
                ];
                fetchLikeStatuses(allIds);
            } catch (error) {
                console.error("Failed to fetch playlists:", error);
            }
        };

        fetchPlaylists();
    }, [fetchLikeStatuses]);

    useEffect(() => {
        if (showSearchResults && searchResults.length > 0 && user) {
            const searchIds = searchResults.map((p) => p.id);
            fetchLikeStatuses(searchIds);
        }
    }, [showSearchResults, searchResults, user, fetchLikeStatuses]);

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength
            ? text.substring(0, maxLength) + "..."
            : text;
    };

    // In your searchPlaylists function:
    const searchPlaylists = async (query: string) => {
        if (!query) {
            setSearchError(null);
            setShowSearchResults(false);
            return;
        }

        setIsSearching(true);
        setSearchError(null);

        try {
            const res = await fetch(
                `/api/playlists/search?q=${encodeURIComponent(query)}`
            );
            if (!res.ok) {
                throw new Error("Failed to search");
            }
            const data = await res.json();

            // Handle both array response and Spotify-style response
            let results = [];
            if (Array.isArray(data)) {
                results = data.filter(Boolean).map(transformPlaylist);
            } else if (data.playlists?.items) {
                results = data.playlists.items
                    .filter(Boolean)
                    .map(transformPlaylist);
            }

            setSearchResults(results);
            setShowSearchResults(true);
        } catch (error) {
            console.error("Playlist search error:", error);
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
                {/* Page Header with Search */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-[#0C3B2E]">
                                Playlists
                            </h1>
                            <p className="text-[#0C3B2E]/70 mt-2">
                                Discover and organize your favorite music
                                collections
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="w-full md:w-[320px]">
                            <div className="relative h-full">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search playlists..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        searchPlaylists(e.target.value);
                                    }}
                                    className="w-full h-full pl-10 pr-4 py-3 bg-[#FFFFF0] border border-[#D9D9D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6D9773]"
                                />
                                {isSearching && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#6D9773]"></div>
                                    </div>
                                )}
                                {searchTerm && !isSearching && (
                                    <button
                                        onClick={() => {
                                            setSearchTerm("");
                                            setShowSearchResults(false);
                                        }}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#A0A0A0] hover:text-[#6D9773]">
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            {searchError && (
                                <p className="text-red-500 text-sm mt-1">
                                    {searchError}
                                </p>
                            )}
                        </div>

                        <button 
                            onClick={() => setShowCreateModal(true)}
                            className="bg-[#FFBA00] text-[#1F2C24] px-4 py-3 rounded-lg font-bold hover:bg-[#FFBA00]/90 transition-colors flex items-center gap-2 shadow-md"
                        >
                            <Plus className="w-5 h-5" />
                            Create Playlist
                        </button>
                    </div>
                </div>

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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {searchResults.map((playlist) => (
                                    <PlaylistCard
                                        key={`search-${playlist.id}`}
                                        playlist={playlist}
                                        isLiked={likes[playlist.id] || false}
                                        isLoading={
                                            isLoadingLikes[playlist.id] || false
                                        }
                                        onLikeToggle={handleLikeClick}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-[#A0A0A0]">
                                {isSearching
                                    ? "Searching..."
                                    : "No playlists found"}
                            </p>
                        )}
                    </div>
                )}

                {/* Popular This Week Section */}
                {!showSearchResults && (
                    <>
                        <div className="mb-12">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-[#0C3B2E]">
                                    <span className="text-[#FFBA00]">
                                        Popular
                                    </span>{" "}
                                    This Week
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {popularPlaylists.map((playlist) => (
                                    <PlaylistCard
                                        key={`search-${playlist.id}`}
                                        playlist={playlist}
                                        isLiked={likes[playlist.id] || false}
                                        isLoading={
                                            isLoadingLikes[playlist.id] || false
                                        }
                                        onLikeToggle={handleLikeClick}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Recently Liked Section */}
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-[#0C3B2E]">
                                    Recently Liked Playlists
                                </h2>
                            </div>

                            <div className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-xl overflow-hidden">
                                {recentlyLikedPlaylists.map(
                                    (playlist, index) => (
                                        <PlaylistListItem
                                            key={`liked-${playlist.id}`}
                                            playlist={playlist}
                                            isLiked={
                                                likes[playlist.id] || false
                                            }
                                            isLoading={
                                                isLoadingLikes[playlist.id] ||
                                                false
                                            }
                                            onLikeToggle={handleLikeClick}
                                            isLastItem={
                                                index ===
                                                recentlyLikedPlaylists.length -
                                                    1
                                            }
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Footer variant="light" />
            <CreatePlaylistModal 
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </div>
    );
};

export default Playlists;
