"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Search,
    ChevronDown,
    Music,
    Heart,
    Users,
    User,
    Settings,
    LogOut,
    BookOpen,
    MessageSquare,
    FileText,
    Menu,
    X,
    Plus,
    Disc,
    Disc3,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import LogModal from "./log/LogModal";
import { usePathname, useRouter } from "next/navigation";

interface HeaderProps {
    user?: {
        name: string;
        avatar?: string;
        username: string;
    };
}

interface SpotifyUser {
    display_name: string;
    email: string;
    images?: { url: string }[];
    id: string;
}

interface SearchResult {
    id: string;
    name: string;
    artists?: { name: string }[];
    album?: { name: string; images: { url: string }[] };
    images?: { url: string }[];
    owner?: { display_name: string };
    type: "track" | "album" | "playlist";
}

interface SearchResults {
    tracks: SearchResult[];
    albums: SearchResult[];
    playlists: SearchResult[];
}

const Header: React.FC<HeaderProps> = ({}) => {
    const router = useRouter(); // Initialize router
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [spotifyUser, setSpotifyUser] = useState<SpotifyUser | null>(null);
    const [trackDetails, setTrackDetails] = useState<any>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const pathname = usePathname();

    // Add these states
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResults | null>(
        null
    );
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

    // Search handler with debounce
    useEffect(() => {
        const search = async () => {
            if (!searchQuery.trim()) {
                setSearchResults(null);
                setShowResults(false);
                return;
            }

            setIsSearching(true);
            setShowResults(true);

            try {
                const res = await fetch(
                    `/api/search/tracksAlbumsAndPlaylists?q=${encodeURIComponent(
                        searchQuery
                    )}&trackLimit=3&albumLimit=2&playlistLimit=2`
                );

                if (!res.ok) throw new Error("Search failed");
                const data = await res.json();
                setSearchResults(data);
            } catch (error) {
                console.error("Search error:", error);
                setSearchResults(null);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(search, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const clickedOutsideDesktop =
                searchContainerRef.current &&
                !searchContainerRef.current.contains(e.target as Node);
            const clickedOutsideMobile =
                mobileSearchContainerRef.current &&
                !mobileSearchContainerRef.current.contains(e.target as Node);

            if (isSearchExpanded && clickedOutsideDesktop) {
                setIsSearchExpanded(false);
                setSearchQuery(""); // Clear search when closing
                setShowResults(false);
            }

            if (isMobileSearchExpanded && clickedOutsideMobile) {
                setIsMobileSearchExpanded(false);
                setSearchQuery(""); // Clear search when closing
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close results when navigating
    useEffect(() => {
        setShowResults(false);
    }, [pathname]);

    // Handle search item click
    const handleResultClick = (type: string, id: string) => {
        switch (type) {
            case "track":
                router.push(`/songs/${id}`);
                break;
            case "album":
                router.push(`/albums/${id}`);
                break;
            case "playlist":
                router.push(`/playlists/${id}`);
                break;
            default:
                console.warn("Unknown type:", type);
                return;
        }
        setSearchQuery("");
        setShowResults(false);
    };

    useEffect(() => {
        const fetchSpotifyUser = async () => {
            try {
                const res = await fetch("/api/me");
                if (!res.ok) throw new Error("Failed to fetch user");
                const data = await res.json();
                setSpotifyUser(data);
                console.log("Spotify user data:", data);
            } catch (error) {
                console.error("Error fetching Spotify user:", error);
            }
        };

        fetchSpotifyUser();
    }, []);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    const user = {
        name: spotifyUser?.display_name || "Guest User",
        avatar: spotifyUser?.images?.[0]?.url,
        username: spotifyUser?.email?.split("@")[0] || "guest",
    };

    useEffect(() => {
        if (isSearchExpanded || isMobileSearchExpanded) {
            searchRef.current?.focus();
        }
    }, [isSearchExpanded, isMobileSearchExpanded]);

    const toggleSearch = () => {
        setIsSearchExpanded(!isSearchExpanded);
    };

    const toggleMobileSearch = () => {
        setIsMobileSearchExpanded(!isMobileSearchExpanded);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(e.target as Node)
            ) {
                setIsSearchExpanded(false);
                setIsMobileSearchExpanded(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Added logout handler
    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout");
            if (response.ok) {
                router.push("/");
                router.refresh();
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const navItems = [
        { label: "Activity", href: "/activity", active: false },
        { label: "Songs", href: "/songs", active: false },
        { label: "Playlists", href: "/playlists", active: false },
        { label: "Albums", href: "/albums", active: false },
    ];

    const dropdownItems = [
        { label: "Profile", href: `/profile/${user.username}`, icon: User },
        { type: "divider" },
        { label: "My Likes", href: "/my-likes", icon: Heart },
        { label: "My Reviews", href: "/my-reviews", icon: MessageSquare },
        { label: "My Annotations", href: "/my-annotations", icon: FileText },
        { type: "divider" },
        // Updated logout item to use handler instead of href
        { label: "Logout", onClick: handleLogout, icon: LogOut },
    ];

    const SearchResultItem = ({ item }: { item: SearchResult }) => {
        const imageUrl = item.album?.images?.[0]?.url || item.images?.[0]?.url;
        const artists = item.artists?.map((a) => a.name).join(", ") || "";
        const subtitle =
            item.type === "playlist"
                ? `By ${item.owner?.display_name || "Unknown"}`
                : artists;

        return (
            <div
                className="flex items-center gap-3 p-3 hover:bg-[#FFFFD5] rounded-lg cursor-pointer"
                onClick={() => handleResultClick(item.type, item.id)}>
                <div className="relative">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                    ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 flex items-center justify-center">
                            <Music className="text-gray-400 w-5 h-5" />
                        </div>
                    )}
                    <div className="absolute bottom-1 right-1 bg-black/70 rounded-full p-1">
                        {item.type === "track" ? (
                            <Disc className="w-3 h-3 text-white" />
                        ) : item.type === "album" ? (
                            <Disc3 className="w-3 h-3 text-white" />
                        ) : (
                            <Users className="w-3 h-3 text-white" />
                        )}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-medium text-[#1F2C24] truncate">
                            {item.name}
                        </h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-[#0C3B2E]/10 text-[#0C3B2E]">
                            {item.type.toUpperCase()}
                        </span>
                    </div>
                    <p className="text-sm text-[#A0A0A0] truncate">
                        {subtitle}
                    </p>
                </div>
            </div>
        );
    };

    const ClearSearchButton = ({ onClick }: { onClick: () => void }) => (
        <button
            onClick={onClick}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-[#FFFFD5]">
            <X className="w-4 h-4 text-[#1F2C24]" />
        </button>
    );

    return (
        <header className="bg-[#FFFFE7] border-b border-[#D9D9D9] sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left - Logo and Title */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-auto">
                                <Image
                                    src="/logo1.svg"
                                    alt="Trackboxd Logo"
                                    width={40}
                                    height={60}
                                    className="h-full w-auto"
                                />
                            </div>
                            <h1 className="text-2xl font-bold text-[#1F2C24] tracking-tight">
                                Trackboxd
                            </h1>
                        </div>
                    </div>

                    {/* Middle - Navigation (desktop) */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    item.active
                                        ? "bg-[#0C3B2E] text-[#F9F9F9]"
                                        : "text-[#1F2C24] hover:bg-[#FFFFD5] hover:text-[#1F2C24]"
                                }`}>
                                {item.label}
                            </a>
                        ))}
                        <div className="relative ml-2">
                            <div className="relative" ref={searchContainerRef}>
                                <div
                                    className={`flex items-center transition-all duration-300 ${
                                        isSearchExpanded ? "w-48" : "w-10"
                                    }`}>
                                    {isSearchExpanded ? (
                                        <div className="w-full">
                                            <Input
                                                type="text"
                                                placeholder="Search tracks, albums, playlists..."
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full border border-[#1F2C24] text-[#1F2C24] rounded-lg pl-3 pr-8 py-2 h-10 bg-[#FFFFE7] focus:outline-none" // Removed focus ring
                                                onFocus={() =>
                                                    setShowResults(true)
                                                }
                                                autoFocus // Auto-focus when expanded
                                            />
                                        </div>
                                    ) : (
                                        <button
                                            onClick={toggleSearch}
                                            className="p-2 rounded-lg text-[#1F2C24] hover:bg-[#FFFFD5] transition-colors duration-200">
                                            <Search className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>

                                {isSearchExpanded && (
                                    <ClearSearchButton
                                        onClick={() => {
                                            setSearchQuery("");
                                            toggleSearch();
                                        }}
                                    />
                                )}

                                {/* Search Results Dropdown */}
                                {showResults && (
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-[#FFFFE7] border border-[#D9D9D9] rounded-lg shadow-lg z-50 max-h-[700px] overflow-y-auto min-w-[400px] max-w-[600px]">
                                        {isSearching ? (
                                            <div className="p-4 text-center text-[#A0A0A0]">
                                                Searching...
                                            </div>
                                        ) : searchResults ? (
                                            <div className="py-2">
                                                {/* Filter out null items before mapping */}
                                                {searchResults.tracks.filter(
                                                    Boolean
                                                ).length > 0 && (
                                                    <>
                                                        <div className="px-4 py-2 text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider">
                                                            Tracks
                                                        </div>
                                                        <div className="mb-2">
                                                            {searchResults.tracks
                                                                .filter(Boolean)
                                                                .map(
                                                                    (track) => (
                                                                        <SearchResultItem
                                                                            key={`track-${track.id}`}
                                                                            item={
                                                                                track
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                        </div>
                                                    </>
                                                )}

                                                {searchResults.albums.filter(
                                                    Boolean
                                                ).length > 0 && (
                                                    <>
                                                        <div className="h-px bg-[#D9D9D9] mx-4 my-1" />
                                                        <div className="px-4 py-2 text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider">
                                                            Albums
                                                        </div>
                                                        <div className="mb-2">
                                                            {searchResults.albums
                                                                .filter(Boolean)
                                                                .map(
                                                                    (album) => (
                                                                        <SearchResultItem
                                                                            key={`album-${album.id}`}
                                                                            item={
                                                                                album
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                        </div>
                                                    </>
                                                )}

                                                {searchResults.playlists.filter(
                                                    Boolean
                                                ).length > 0 && (
                                                    <>
                                                        <div className="h-px bg-[#D9D9D9] mx-4 my-1" />
                                                        <div className="px-4 py-2 text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider">
                                                            Playlists
                                                        </div>
                                                        <div className="mb-2">
                                                            {searchResults.playlists
                                                                .filter(Boolean)
                                                                .map(
                                                                    (
                                                                        playlist
                                                                    ) => (
                                                                        <SearchResultItem
                                                                            key={`playlist-${playlist.id}`}
                                                                            item={
                                                                                playlist
                                                                            }
                                                                        />
                                                                    )
                                                                )}
                                                        </div>
                                                    </>
                                                )}

                                                {/* Updated no results condition */}
                                                {searchResults.tracks.filter(
                                                    Boolean
                                                ).length === 0 &&
                                                    searchResults.albums.filter(
                                                        Boolean
                                                    ).length === 0 &&
                                                    searchResults.playlists.filter(
                                                        Boolean
                                                    ).length === 0 && (
                                                        <div className="px-4 py-8 text-center text-[#A0A0A0]">
                                                            No results found
                                                        </div>
                                                    )}
                                            </div>
                                        ) : searchQuery ? (
                                            <div className="px-4 py-8 text-center text-[#A0A0A0]">
                                                No results found
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        </div>
                    </nav>

                    {/* Right - Actions Section (desktop) */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsLogModalOpen(true)}
                            className="hidden md:flex items-center gap-1.5 bg-[#FFBA00] text-[#1F2C24] py-2 px-4 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] shadow-sm">
                            <Plus className="w-4 h-4" />
                            <span className="font-medium text-sm">Log</span>
                        </button>

                        {/* User Section */}
                        <div className="hidden md:block relative">
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#FFFFD5] transition-colors duration-200">
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-full bg-[#0C3B2E] flex items-center justify-center ring-2 ring-[#FFBA00]">
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-[#F9F9F9] text-sm font-semibold">
                                                {getInitials(
                                                    spotifyUser?.display_name ||
                                                        "Guest User"
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <span className="text-sm font-medium text-[#1F2C24]">
                                    {spotifyUser?.display_name || "Guest User"}
                                </span>

                                <ChevronDown
                                    className={`w-4 h-4 text-[#A0A0A0] transition-transform duration-200 ${
                                        isDropdownOpen ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {isDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10 md:hidden"
                                        onClick={() => setIsDropdownOpen(false)}
                                    />

                                    <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-1/25 top-full mt-2 w-56 bg-[#FFFFF0] rounded-xl shadow-lg border border-[#D9D9D9] py-2 z-20">
                                        {dropdownItems.map((item, index) =>
                                            item.type === "divider" ? (
                                                <div
                                                    key={index}
                                                    className="h-px bg-[#D9D9D9] my-2"
                                                />
                                            ) : (
                                                <button
                                                    key={item.label}
                                                    onClick={
                                                        item.onClick ||
                                                        (() => {})
                                                    }
                                                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm text-left text-[#1F2C24] hover:bg-[#FFFFD5] transition-colors duration-200 ${
                                                        item.onClick
                                                            ? "cursor-pointer"
                                                            : ""
                                                    }`}>
                                                    {item.icon && (
                                                        <item.icon className="w-4 h-4 text-[#A0A0A0]" />
                                                    )}
                                                    {item.label}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center gap-2">
                        {/* Log + Button - Mobile (always visible) */}
                        <button
                            onClick={() => setIsLogModalOpen(true)}
                            className="flex md:hidden ml-2 mr-2 items-center gap-1 bg-[#FFBA00] text-[#1F2C24] p-2 rounded-lg transition-all duration-200 ease-in-out">
                            <Plus className="w-4 h-4" />
                        </button>

                        <div className="relative">
                            <div
                                className={`flex items-center transition-all duration-300 ${
                                    isMobileSearchExpanded ? "w-40" : "w-10"
                                }`}
                                ref={mobileSearchContainerRef} // Added ref
                            >
                                {isMobileSearchExpanded ? (
                                    <div className="w-full">
                                        <Input
                                            type="text"
                                            placeholder="Search tracks, albums, playlists..."
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            className="w-full border border-[#1F2C24] text-[#1F2C24] rounded-lg pl-3 pr-8 py-2 h-10 bg-[#FFFFE7] focus:outline-none" // Removed focus ring
                                            onFocus={() => setShowResults(true)}
                                            autoFocus // Auto-focus when expanded
                                        />

                                        {/* Mobile search results dropdown - ADDED */}
                                        {showResults && (
                                            <div className="fixed top-16 left-0 right-0 mx-auto bg-[#FFFFE7] border border-[#D9D9D9] rounded-lg shadow-lg z-50 max-h-[70vh] overflow-y-auto w-[90vw]">
                                                {/* Added width */}
                                                {isSearching ? (
                                                    <div className="p-4 text-center text-[#A0A0A0]">
                                                        Searching...
                                                    </div>
                                                ) : searchResults ? (
                                                    <div className="py-2">
                                                        {searchResults.tracks.filter(
                                                            Boolean
                                                        ).length > 0 && (
                                                            <>
                                                                <div className="px-4 py-2 text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider">
                                                                    Tracks
                                                                </div>
                                                                <div className="mb-2">
                                                                    {searchResults.tracks
                                                                        .filter(
                                                                            Boolean
                                                                        )
                                                                        .map(
                                                                            (
                                                                                track
                                                                            ) => (
                                                                                <SearchResultItem
                                                                                    key={`track-${track.id}`}
                                                                                    item={
                                                                                        track
                                                                                    }
                                                                                />
                                                                            )
                                                                        )}
                                                                </div>
                                                            </>
                                                        )}

                                                        {searchResults.albums.filter(
                                                            Boolean
                                                        ).length > 0 && (
                                                            <>
                                                                <div className="h-px bg-[#D9D9D9] mx-4 my-1" />
                                                                <div className="px-4 py-2 text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider">
                                                                    Albums
                                                                </div>
                                                                <div className="mb-2">
                                                                    {searchResults.albums
                                                                        .filter(
                                                                            Boolean
                                                                        )
                                                                        .map(
                                                                            (
                                                                                album
                                                                            ) => (
                                                                                <SearchResultItem
                                                                                    key={`album-${album.id}`}
                                                                                    item={
                                                                                        album
                                                                                    }
                                                                                />
                                                                            )
                                                                        )}
                                                                </div>
                                                            </>
                                                        )}

                                                        {searchResults.playlists.filter(
                                                            Boolean
                                                        ).length > 0 && (
                                                            <>
                                                                <div className="h-px bg-[#D9D9D9] mx-4 my-1" />
                                                                <div className="px-4 py-2 text-xs font-semibold text-[#A0A0A0] uppercase tracking-wider">
                                                                    Playlists
                                                                </div>
                                                                <div className="mb-2">
                                                                    {searchResults.playlists
                                                                        .filter(
                                                                            Boolean
                                                                        )
                                                                        .map(
                                                                            (
                                                                                playlist
                                                                            ) => (
                                                                                <SearchResultItem
                                                                                    key={`playlist-${playlist.id}`}
                                                                                    item={
                                                                                        playlist
                                                                                    }
                                                                                />
                                                                            )
                                                                        )}
                                                                </div>
                                                            </>
                                                        )}

                                                        {searchResults.tracks.filter(
                                                            Boolean
                                                        ).length === 0 &&
                                                            searchResults.albums.filter(
                                                                Boolean
                                                            ).length === 0 &&
                                                            searchResults.playlists.filter(
                                                                Boolean
                                                            ).length === 0 && (
                                                                <div className="px-4 py-8 text-center text-[#A0A0A0]">
                                                                    No results
                                                                    found
                                                                </div>
                                                            )}
                                                    </div>
                                                ) : searchQuery ? (
                                                    <div className="px-4 py-8 text-center text-[#A0A0A0]">
                                                        No results found
                                                    </div>
                                                ) : null}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={toggleMobileSearch}
                                        className="p-2 rounded-lg text-[#1F2C24] hover:bg-[#FFFFD5] transition-colors duration-200">
                                        <Search className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            {isMobileSearchExpanded && (
                                <ClearSearchButton
                                    onClick={() => {
                                        setSearchQuery("");
                                        toggleMobileSearch();
                                        setShowResults(false);
                                    }}
                                />
                            )}
                        </div>

                        <button
                            onClick={toggleMobileMenu}
                            className="p-2 rounded-lg text-[#1F2C24] hover:bg-[#FFFFD5] transition-colors duration-200">
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden">
                    {/* Navigation */}
                    <div className="px-4 py-3">
                        <nav className="flex flex-col gap-1">
                            {navItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    className={`px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                                        item.active
                                            ? "bg-[#0C3B2E] text-[#F9F9F9]"
                                            : "text-[#1F2C24] hover:bg-[#FFFFD5]"
                                    }`}>
                                    {item.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* User Section */}
                    <div className="border-t border-[#D9D9D9] px-4 py-3">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-[#0C3B2E] flex items-center justify-center ring-2 ring-[#FFBA00]">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={spotifyUser?.display_name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-[#F9F9F9] text-base font-semibold">
                                            {getInitials(
                                                spotifyUser?.display_name ||
                                                    "Guest User"
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="font-medium text-[#1F2C24]">
                                    {spotifyUser?.display_name || "Guest User"}
                                </div>
                                <div className="text-sm text-[#A0A0A0]">
                                    {spotifyUser?.email || "guest@example.com"}
                                </div>
                            </div>
                        </div>

                        {/* Dropdown Menu */}
                        <div className="flex flex-col gap-1">
                            {dropdownItems.map((item, index) =>
                                item.type === "divider" ? (
                                    <div
                                        key={index}
                                        className="h-px bg-[#D9D9D9] my-2"
                                    />
                                ) : (
                                    <button
                                        key={item.label}
                                        onClick={item.onClick || (() => {})}
                                        className={`flex items-center gap-3 px-3 py-3 text-base text-left text-[#1F2C24] hover:bg-[#FFFFD5] transition-colors duration-200 rounded-lg ${
                                            item.onClick ? "cursor-pointer" : ""
                                        }`}>
                                        {item.icon && (
                                            <item.icon className="w-5 h-5 text-[#A0A0A0]" />
                                        )}
                                        {item.label}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
            <LogModal
                isOpen={isLogModalOpen}
                onClose={() => setIsLogModalOpen(false)}
            />
        </header>
    );
};

export default Header;
