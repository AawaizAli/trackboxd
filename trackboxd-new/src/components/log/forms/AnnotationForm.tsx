"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Music, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUser from "@/hooks/useUser";
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';

interface InitialAnnotation {
  id: string;
  text: string;
  timestamp: number;
  isPublic: boolean;
  track?: SimplifiedTrack;
}

interface SimplifiedTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  coverArt: string;
}

interface AnnotationFormProps {
  onClose: () => void;
  initialTrack?: SimplifiedTrack;
  initialAnnotation?: InitialAnnotation; // Add this
  onSave?: (annotation: InitialAnnotation) => void; // Add this
}

const AnnotationForm: React.FC<AnnotationFormProps> = ({ 
  onClose, 
  initialTrack, 
  initialAnnotation,
  onSave
}) => {
  const { user, loading: userLoading, error: userError } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState<SimplifiedTrack | null>(
    initialTrack || null
  );
  const [timestamp, setTimestamp] = useState("");
  const [annotationText, setAnnotationText] = useState("");
  const [searchResults, setSearchResults] = useState<SimplifiedTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [trendingTracks, setTrendingTracks] = useState<SimplifiedTrack[]>([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');

  // Fetch trending tracks on mount
  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (initialAnnotation) {
      setSelectedTrack({
        id: initialAnnotation.track?.id || '',
        name: initialAnnotation.track?.name || '',
        artist: initialAnnotation.track?.artist || '',
        album: initialAnnotation.track?.album || '',
        coverArt: initialAnnotation.track?.coverArt || ''
      });
      
      // Convert seconds to mm:ss format
      const minutes = Math.floor(initialAnnotation.timestamp / 60);
      const seconds = Math.floor(initialAnnotation.timestamp % 60);
      setTimestamp(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      
      setAnnotationText(initialAnnotation.text);
      setVisibility(initialAnnotation.isPublic ? 'public' : 'private');
    }
  }, [initialAnnotation]);

  // Debounce search requests
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError(null);
      return;
    }

    const handler = setTimeout(() => {
      searchSpotify(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const searchSpotify = async (query: string) => {
    setIsSearching(true);
    setSearchError(null);

    try {
      const res = await fetch(`/api/songs/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        throw new Error("Failed to search");
      }
      const data = await res.json();
      
      // Convert Spotify tracks to simplified format
      const results = data.tracks?.items?.map((track: any) => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map((a: any) => a.name).join(", "),
        album: track.album.name,
        coverArt: track.album.images[0]?.url || "/default-album.png"
      })) || [];
      
      setSearchResults(results);
    } catch (error) {
      console.error("Spotify search error:", error);
      setSearchError("Failed to search. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTrack) return;
    
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Convert timestamp from mm:ss to seconds
      const timeParts = timestamp.split(':');
      let timestampInSeconds = 0;
      if (timeParts.length === 1) {
        // Only seconds provided
        timestampInSeconds = parseFloat(timeParts[0]);
      } else if (timeParts.length === 2) {
        // Minutes and seconds provided
        timestampInSeconds = (parseInt(timeParts[0]) * 60) + parseFloat(timeParts[1]);
      } else {
        throw new Error('Invalid timestamp format. Use mm:ss or ss');
      }

      if (isNaN(timestampInSeconds)) {
        throw new Error('Invalid timestamp value');
      }

      const url = initialAnnotation 
        ? `/api/annotate/actions/${initialAnnotation.id}`
        : '/api/annotate';
      
      const method = initialAnnotation ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // For edit mode, we don't send trackId
          ...(initialAnnotation ? {} : { trackId: selectedTrack.id }),
          timestamp: timestampInSeconds,
          text: annotationText,
          isPublic: visibility === 'public',
          userId: user?.id
        })
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Invalid response: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create annotation');
      }

      const annotationData = await response.json();
      
      if (initialAnnotation && onSave) {
        onSave({
          ...initialAnnotation,
          text: annotationText,
          timestamp: timestampInSeconds,
          isPublic: visibility === 'public'
        });
      }
      
      console.log('Annotation saved:', annotationData);
      onClose();
    } catch (error) {
      console.error('Annotation submission error:', error);
      
      // Simplify error message for HTML responses
      let errorMessage = 'Failed to create annotation';
      if (error instanceof Error) {
        errorMessage = error.message.includes('Invalid response: <!DOCTYPE')
          ? 'Server error: Please try again later'
          : error.message;
      }

      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!selectedTrack ? (
        <div className="space-y-4">
          <h3 className="font-medium text-[#1F2C24]">
            Search for a track to annotate
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#A0A0A0]" />
            <Input
              type="search"
              placeholder="Search tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 py-6 rounded-xl bg-[#FFFFE7] border border-[#D9D9D9]"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-5 h-5 text-[#6D9773] animate-spin" />
              </div>
            )}
            {searchQuery && !isSearching && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-5 h-5 text-[#A0A0A0]" />
              </button>
            )}
          </div>

          {searchError && (
            <p className="text-red-500 text-sm">{searchError}</p>
          )}

          {/* Content Area */}
          <div className="border rounded-lg p-4 bg-[#FFFFE7] border-[#D9D9D9]">
            {searchQuery ? (
              // Search Results
              searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-3 p-3 hover:bg-[#FFFFD5] rounded-lg cursor-pointer"
                      onClick={() => setSelectedTrack(track)}
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
                        <p className="text-xs text-[#A0A0A0] truncate">
                          {track.album}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[#A0A0A0]">
                  <Music className="w-12 h-12 mx-auto mb-2" />
                  <p>No results found for "{searchQuery}"</p>
                </div>
              )
            ) : (
              // Trending Tracks
              <>
                <h4 className="text-sm font-medium text-[#1F2C24] mb-3">
                  Trending This Week
                </h4>
                {isLoadingTrending ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="w-8 h-8 text-[#6D9773] animate-spin" />
                  </div>
                ) : trendingTracks.length > 0 ? (
                  <div className="space-y-3">
                    {trendingTracks.map((track) => (
                      <div
                        key={`trending-${track.id}`}
                        className="flex items-center gap-3 p-3 hover:bg-[#FFFFD5] rounded-lg cursor-pointer"
                        onClick={() => setSelectedTrack(track)}
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
              Annotating: <span className="font-bold">{selectedTrack.name}</span>
            </h3>
            <button
              type="button"
              onClick={() => setSelectedTrack(null)}
              className="text-[#A0A0A0] hover:text-[#1F2C24]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 p-4 bg-[#FFFFE7] rounded-lg border border-[#D9D9D9]">
            <div className="w-16 h-16 relative overflow-hidden rounded-lg bg-gray-200 flex-shrink-0">
              <img
                src={selectedTrack.coverArt}
                alt={`${selectedTrack.name} cover`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-[#1F2C24] truncate">
                {selectedTrack.name}
              </h4>
              <p className="text-sm text-[#A0A0A0] truncate">
                {selectedTrack.artist}
              </p>
              <p className="text-xs text-[#A0A0A0] truncate">
                {selectedTrack.album}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1F2C24] mb-2">
                Timestamp (mm:ss or ss)
              </label>
              <Input
                type="text"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder="e.g., 1:23 or 83"
                className="w-32"
              />
              <p className="text-xs text-[#A0A0A0] mt-1">
                Enter the time where your annotation applies
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1F2C24] mb-2">
                Annotation
              </label>
              <textarea
                value={annotationText}
                onChange={(e) => setAnnotationText(e.target.value)}
                placeholder="Add your annotation..."
                className="w-full p-4 rounded-lg border border-[#D9D9D9] bg-[#FFFFE7] min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[#0C3B2E]"
              />
            </div>

            {/* Visibility Toggle */}
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
                aria-label="annotation visibility"
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
                disabled={!timestamp || !annotationText || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Posting...
                  </div>
                ) : "Post Annotation"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default AnnotationForm;