"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Music, Disc, Disc3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUser from "@/hooks/useUser"; // if not already imported

interface ReviewFormProps {
  onClose: () => void;
}

interface SpotifyItem {
  id: string;
  name: string;
  artists: { name: string }[];
  album?: {
    name: string;
    images: { url: string }[];
  };
  images?: { url: string }[];
  type: 'track' | 'album';
}

interface SpotifyAPIResponse {
  tracks: SpotifyTrack[];  // Removed the nested items array
  albums: SpotifyAlbum[];
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: {
    name: string;
    images: SpotifyImage[];
  };
}

interface SpotifyAlbum {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  images: SpotifyImage[];
}

interface SpotifyArtist {
  name: string;
}

interface SpotifyImage {
  url: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<SpotifyItem | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");
  const [searchResults, setSearchResults] = useState<SpotifyItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { user, loading: userLoading, error: userError } = useUser();

  // Search when query changes (with debounce)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const search = async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const response = await fetch(
          `/api/search/tracksAndAlbums?q=${encodeURIComponent(searchQuery)}&trackLimit=6&albumLimit=4`
        );
        
        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`);
        }

        const data: SpotifyAPIResponse = await response.json();
        console.log('Raw search results:', data);
        
        // Transform tracks to SpotifyItem format
        const transformedTracks = (data.tracks || []).map(track => ({
          id: track.id,
          name: track.name,
          artists: track.artists,
          album: {
            name: track.album.name,
            images: track.album.images
          },
          type: 'track' as const
        }));

        // Transform albums to SpotifyItem format
        const transformedAlbums = (data.albums || []).map(album => ({
          id: album.id,
          name: album.name,
          artists: album.artists,
          images: album.images,
          type: 'album' as const
        }));

        // Combine and set results
        const combinedResults: SpotifyItem[] = [...transformedTracks, ...transformedAlbums];
        console.log('Transformed tracks:', transformedTracks);
        console.log('Transformed albums:', transformedAlbums);
        console.log('Combined results:', combinedResults);
        
        setSearchResults(combinedResults);
      } catch (error) {
        console.error('Search error:', error);
        setSearchError('Failed to search. Please try again.');
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(search, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: selectedItem?.id,
          itemType: selectedItem?.type,
          rating: rating,
          text: reviewText,
          isPublic: true,
          userId: user?.id  // ADD THIS LINE
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      const reviewData = await response.json();
      console.log('Review created:', reviewData);
      onClose();
    } catch (error) {
      console.error('Review submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get image URL for an item (handles both tracks and albums)
  const getImageUrl = (item: SpotifyItem): string | undefined => {
    return item.album?.images?.[0]?.url || 
           item.images?.[0]?.url || 
           undefined;
  };

  // Get artist name(s) for display
  const getArtists = (item: SpotifyItem) => {
    return item.artists?.map(artist => artist.name).join(", ") || "Unknown Artist";
  };

  // Get album name for tracks
  const getAlbumName = (item: SpotifyItem) => {
    return item.album?.name || "Album";
  };

  // Replace your star rating UI with this updated version that includes half stars
  const StarRating = () => {
    const handleStarClick = (rating: number) => {
      setRating(rating);
    };

    const handleStarHover = (e: React.MouseEvent<HTMLButtonElement>, rating: number) => {
      const button = e.currentTarget;
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const half = rect.width / 2;
      
      // If cursor is on the left half of the star, set half rating
      if (x < half) {
        setRating(rating - 0.5);
      } else {
        setRating(rating);
      }
    };

    return (
      <div>
        <label className="block text-sm font-medium text-[#1F2C24] mb-2">
          Rating
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={(e) => handleStarHover(e, star)}
              onMouseMove={(e) => handleStarHover(e, star)}
              onMouseLeave={() => handleStarClick(rating)}
              className="relative w-8 h-8 text-2xl"
            >
              <span className="absolute inset-0 flex items-center justify-center text-[#D9D9D9]">
                ★
              </span>
              <span 
                className="absolute inset-0 flex items-center justify-center text-[#FFBA00] overflow-hidden"
                style={{
                  width: rating >= star 
                    ? '100%' 
                    : rating > star - 1 
                      ? '50%' 
                      : '0%'
                }}
              >
                ★
              </span>
            </button>
          ))}
          <span className="ml-2 text-sm text-[#1F2C24]">
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!selectedItem ? (
        <div className="space-y-4">
          <h3 className="font-medium text-[#1F2C24]">
            Search for a track or album to review
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#A0A0A0]" />
            <Input
              type="search"
              placeholder="Search tracks or albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 py-6 rounded-xl bg-[#FFFFE7] border border-[#D9D9D9]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-5 h-5 text-[#A0A0A0]" />
              </button>
            )}
          </div>

          {/* Search Results - Scrollable container */}
          <div className="border rounded-lg p-4 bg-[#FFFFE7] border-[#D9D9D9] max-h-96 overflow-y-auto">
            {isSearching ? (
              <div className="flex justify-center py-4">
                <p className="text-[#A0A0A0]">Searching...</p>
              </div>
            ) : searchError ? (
              <div className="text-center py-4 text-red-500">
                {searchError}
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-3">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 hover:bg-[#FFFFD5] rounded-lg cursor-pointer group"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="relative">
                      {getImageUrl(item) ? (
                        <img 
                          src={getImageUrl(item)} 
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                          <Music className="text-gray-400 w-6 h-6" />
                        </div>
                      )}
                      <div className="absolute bottom-1 right-1 bg-black/70 rounded-full p-1">
                        {item.type === 'track' ? (
                          <Disc className="w-3 h-3 text-white" />
                        ) : (
                          <Disc3 className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-[#1F2C24] truncate">{item.name}</h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-[#0C3B2E]/10 text-[#0C3B2E]">
                          {item.type === 'track' ? 'TRACK' : 'ALBUM'}
                        </span>
                      </div>
                      <p className="text-sm text-[#A0A0A0] truncate">
                        {getArtists(item)}
                        {item.album && ` • ${getAlbumName(item)}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-4 text-[#A0A0A0]">
                No results found for "{searchQuery}"
              </div>
            ) : (
              <div className="text-center py-4 text-[#A0A0A0]">
                Enter a search query above
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-[#1F2C24]">
              Reviewing: <span className="font-bold">{selectedItem.name}</span>
            </h3>
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="text-[#A0A0A0] hover:text-[#1F2C24]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 p-4 bg-[#FFFFE7] rounded-lg border border-[#D9D9D9]">
            <div className="relative">
              {getImageUrl(selectedItem) ? (
                <img 
                  src={getImageUrl(selectedItem)} 
                  alt={selectedItem.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                  <Music className="text-gray-400 w-6 h-6" />
                </div>
              )}
              <div className="absolute bottom-1 right-1 bg-black/70 rounded-full p-1">
                {selectedItem.type === 'track' ? (
                  <Disc className="w-3 h-3 text-white" />
                ) : (
                  <Disc3 className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-[#1F2C24]">{selectedItem.name}</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-[#0C3B2E]/10 text-[#0C3B2E]">
                  {selectedItem.type === 'track' ? 'TRACK' : 'ALBUM'}
                </span>
              </div>
              <p className="text-sm text-[#A0A0A0]">
                {getArtists(selectedItem)}
                {selectedItem.album && ` • ${getAlbumName(selectedItem)}`}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <StarRating />

            <div>
              <label className="block text-sm font-medium text-[#1F2C24] mb-2">
                Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full p-4 rounded-lg border border-[#D9D9D9] bg-[#FFFFE7] min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#0C3B2E]"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            {submitError && (
              <p className="text-red-500 text-sm">{submitError}</p>
            )}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-[#D9D9D9] text-[#1F2C24] hover:bg-[#FFFFD5]"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#0C3B2E] hover:bg-[#0a3328] text-[#F9F9F9]"
                disabled={!rating || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Posting...
                  </div>
                ) : (
                  'Post Review'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default ReviewForm;