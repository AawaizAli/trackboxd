import React from "react";
import { Search, Star } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FiltersProps {
    selectedGenre: string;
    setSelectedGenre: (genre: string) => void;
    selectedMood: string;
    setSelectedMood: (mood: string) => void;
    selectedYear: string;
    setSelectedYear: (year: string) => void;
    selectedRating: string;
    setSelectedRating: (rating: string) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    isSearching: boolean;
    searchError: string | null;
    searchSpotify: (query: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
    selectedGenre,
    setSelectedGenre,
    selectedMood,
    setSelectedMood,
    selectedYear,
    setSelectedYear,
    selectedRating,
    setSelectedRating,
    searchTerm,
    setSearchTerm,
    isSearching,
    searchError,
    searchSpotify,
}) => {

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

    return (
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
                                        onSelect={() => setSelectedMood(mood)}>
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
                                        onSelect={() => setSelectedYear(year)}>
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
    );
};

export default Filters;
