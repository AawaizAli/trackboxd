"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Music, Disc, Disc3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUser from "@/hooks/useUser";
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';

interface SimplifiedTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  coverArt: string;
}

interface SimplifiedAlbum {
  id: string;
  name: string;
  artist: string;
  coverArt: string;
  release_date: string;
}

interface ReviewFormProps {
  onClose: () => void;
  initialTrack?: SimplifiedTrack;
  initialAlbum?: SimplifiedAlbum;
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
  tracks: SpotifyTrack[];
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

const ReviewForm: React.FC<ReviewFormProps> = ({ onClose, initialTrack, initialAlbum }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<SpotifyItem | null>(
    initialTrack ? {
      id: initialTrack.id,
      name: initialTrack.name,
      artists: [{ name: initialTrack.artist }],
      album: {
        name: initialTrack.album,
        images: initialTrack.coverArt ? [{ url: initialTrack.coverArt }] : []
      },
      type: 'track'
    } : initialAlbum ? {
      id: initialAlbum.id,
      name: initialAlbum.name,
      artists: [{ name: initialAlbum.artist }],
      images: initialAlbum.coverArt ? [{ url: initialAlbum.coverArt }] : [],
      type: 'album'
    } : null
  );
  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState("");
  const [searchResults, setSearchResults] = useState<SpotifyItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [trendingTracks, setTrendingTracks] = useState<SimplifiedTrack[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [hover, setHover] = useState(-1);

  const { user, loading: userLoading, error: userError } = useUser();

  // Fetch trending tracks on mount if no initial track
  useEffect(() => {
    if (initialTrack) return;

    const fetchTrendingTracks = async () => {
      try {
        setIsLoadingTrending(true);
        const res = await fetch("/api/songs/global-top-4");
        if (!res.ok) throw new Error("Failed to fetch trending tracks");
        
        const data = await res.json();
        const tracks = data.map((item: any) => ({
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists.map((a: any) => a.name).join(", "),
          album: item.track.album.name,
          coverArt: item.track.album.images[0]?.url || "/default-album.png"
        }));
        
        // Select 3 random trending tracks
        const shuffled = [...tracks].sort(() => 0.5 - Math.random());
        setTrendingTracks(shuffled.slice(0, 3));
      } catch (error) {
        console.error("Error fetching trending tracks:", error);
      } finally {
        setIsLoadingTrending(false);
      }
    };

    fetchTrendingTracks();
  }, [initialTrack]);

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
          isPublic: visibility === 'public',
          userId: user?.id
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

  const getImageUrl = (item: SpotifyItem): string | undefined => {
    return item.album?.images?.[0]?.url || 
           item.images?.[0]?.url || 
           undefined;
  };

  const getArtists = (item: SpotifyItem) => {
    return item.artists?.map(artist => artist.name).join(", ") || "Unknown Artist";
  };

  const getAlbumName = (item: SpotifyItem) => {
    return item.album?.name || "Album";
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
              // Show trending tracks when no search query
              <>
                <h4 className="text-sm font-medium text-[#1F2C24] mb-3">
                  Trending This Week
                </h4>
                {isLoadingTrending ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="w-4 h-4 border-2 border-[#0C3B2E] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : trendingTracks.length > 0 ? (
                  <div className="space-y-3">
                    {trendingTracks.map((track) => (
                      <div
                        key={`trending-${track.id}`}
                        className="flex items-center gap-3 p-3 hover:bg-[#FFFFD5] rounded-lg cursor-pointer"
                        onClick={() => setSelectedItem({
                          id: track.id,
                          name: track.name,
                          artists: [{ name: track.artist }],
                          album: {
                            name: track.album,
                            images: track.coverArt ? [{ url: track.coverArt }] : []
                          },
                          type: 'track'
                        })}
                      >
                        <div className="w-16 h-16 relative overflow-hidden rounded-lg bg-gray-200 flex-shrink-0">
                          <img
                            src={track.coverArt}
                            alt={`${track.name} cover`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-medium text-[#1F2C24] truncate">
                            {track.name}
                          </h4>
                          <p className="text-sm text-[#A0A0A0] truncate">
                            {track.artist}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-[#A0A0A0]">
                    <Music className="w-12 h-12 mx-auto mb-2" />
                    <p>No trending tracks available</p>
                  </div>
                )}
              </>
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
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-[#1F2C24]">
                Rating
              </label>
              <div className="flex items-center gap-4">
                <Rating
                  name="review-rating"
                  value={rating}
                  precision={0.5}
                  size="large"
                  onChange={(event, newValue) => {
                    setRating(newValue || 0);
                  }}
                  onChangeActive={(event, newHover) => {
                    setHover(newHover);
                  }}
                  emptyIcon={
                    <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                  }
                  icon={<StarIcon className="text-[#FFBA00]" fontSize="inherit" />}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2C24]">
                Review
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full p-4 rounded-lg border border-[#D9D9D9] bg-[#FFFFE7] min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#0C3B2E]"
              />
            </div>

            <div className="pt-2">
              <label className="block text-sm font-small text-[#1F2C24] mb-2">
                Visibility
              </label>
              <ToggleButtonGroup
                value={visibility}
                exclusive
                onChange={(e, newVisibility) => {
                  if (newVisibility) setVisibility(newVisibility);
                }}
                aria-label="review visibility"
                className="w-full"
              >
                <ToggleButton
                  value="public"
                  className={`flex-1 py-3 ${visibility === 'public' ? 'bg-[#0C3B2E] text-white' : 'bg-[#FFFFE7] text-[#1F2C24]'}`}
                >
                  <div className="flex items-center gap-2">
                    <PublicIcon fontSize="small" />
                    <span>Public</span>
                  </div>
                </ToggleButton>
                <ToggleButton
                  value="private"
                  className={`flex-1 py-3 ${visibility === 'private' ? 'bg-[#0C3B2E] text-white' : 'bg-[#FFFFE7] text-[#1F2C24]'}`}
                >
                  <div className="flex items-center gap-2">
                    <LockIcon fontSize="small" />
                    <span>Private</span>
                  </div>
                </ToggleButton>
              </ToggleButtonGroup>
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