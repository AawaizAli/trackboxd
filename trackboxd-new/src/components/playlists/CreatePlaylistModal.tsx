"use client";

import React, { useState, useEffect } from "react";
import { X, Music, Plus, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useUser from "@/hooks/useUser";
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import PublicIcon from '@mui/icons-material/Public';
import LockIcon from '@mui/icons-material/Lock';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

interface SimplifiedTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  coverArt: string;
}

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePlaylistModal: React.FC<PlaylistModalProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SimplifiedTrack[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<SimplifiedTrack[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setName("");
      setDescription("");
      setIsPublic(true);
      setIsCollaborative(false);
      setSearchQuery("");
      setSelectedTracks([]);
      setSuccess(false);
    }
  }, [isOpen]);

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
      if (!res.ok) throw new Error("Failed to search");
      
      const data = await res.json();
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

  const addTrack = (track: SimplifiedTrack) => {
    if (selectedTracks.length < 100 && !selectedTracks.some(t => t.id === track.id)) {
        console.log(`Adding track ${track.name} to selected tracks`);
        console.log(`Adding track ${track.id} to selected tracks`);
      setSelectedTracks(prev => [...prev, track]);
    }
  };

  const removeTrack = (trackId: string) => {
    setSelectedTracks(prev => prev.filter(track => track.id !== trackId));
  };

  const handleSubmit = async () => {
    if (!name.trim() || selectedTracks.length === 0) return;

    console.log("Submitting playlist with:", selectedTracks);
    
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          isPublic,
          isCollaborative: isCollaborative,
          trackUris: selectedTracks.map(t => `spotify:track:${t.id}`),
          userId: user?.id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create playlist');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Playlist creation error:', error);
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          className="relative bg-[#FFFFF0] rounded-xl shadow-lg w-full max-w-2xl border border-[#D9D9D9] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-[#FFBA00] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className="w-6 h-6 text-[#1F2C24]" />
              <h2 className="text-xl font-bold text-[#1F2C24]">
                {success ? "Playlist Created!" : "Create New Playlist"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-[#FFD05B] transition-colors"
            >
              <X className="w-6 h-6 text-[#1F2C24]" />
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex border-b border-[#D9D9D9]">
            <div 
              className={`flex-1 text-center py-3 font-medium cursor-pointer 
                ${step === 1 ? 'bg-[#FFFFE7] text-[#0C3B2E] border-b-2 border-[#0C3B2E]' : 'text-[#A0A0A0]'}`}
              onClick={() => setStep(1)}
            >
            Details
            </div>
            <div 
              className={`flex-1 text-center py-3 font-medium cursor-pointer 
                ${step === 2 ? 'bg-[#FFFFE7] text-[#0C3B2E] border-b-2 border-[#0C3B2E]' : 'text-[#A0A0A0]'}`}
              onClick={() => name.trim() && setStep(2)}
            >
              Add Songs
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {success ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Check className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-[#0C3B2E] mb-2">Playlist Created!</h3>
                <p className="text-[#1F2C24]">Your playlist is now available on Spotify</p>
              </div>
            ) : step === 1 ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#1F2C24] mb-2">
                    Playlist Name *
                  </label>
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="My Awesome Playlist"
                    className="w-full p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2C24] mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="What's this playlist about?"
                    className="w-full p-3 rounded-lg border border-[#D9D9D9] bg-[#FFFFE7] min-h-[100px]"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1F2C24] mb-2">
                      Visibility
                    </label>
                    <div className="flex items-center gap-2 mb-1">
                      <ToggleButtonGroup
                        value={isPublic ? 'public' : 'private'}
                        exclusive
                        onChange={(e, value) => {
                          if (value) setIsPublic(value === 'public');
                        }}
                        aria-label="playlist visibility"
                        className="w-full"
                      >
                        <ToggleButton
                          value="public"
                          className={`flex-1 py-3 ${isPublic ? 'bg-[#0C3B2E] text-white' : 'bg-[#FFFFE7] text-[#1F2C24]'}`}
                        >
                          <div className="flex items-center gap-2">
                            <PublicIcon fontSize="small" />
                            <span>Public</span>
                          </div>
                        </ToggleButton>
                        <ToggleButton
                          value="private"
                          className={`flex-1 py-3 ${!isPublic ? 'bg-[#0C3B2E] text-white' : 'bg-[#FFFFE7] text-[#1F2C24]'}`}
                        >
                          <div className="flex items-center gap-2">
                            <LockIcon fontSize="small" />
                            <span>Private</span>
                          </div>
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                    <p className="text-xs text-[#A0A0A0]">
                      This setting will apply to both and Trackboxd
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1F2C24] mb-2">
                      Collaborative
                    </label>
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        type="button"
                        onClick={() => setIsCollaborative(!isCollaborative)}
                        className={`flex items-center gap-2 p-3 rounded-lg w-full transition-colors ${
                          isCollaborative 
                            ? 'bg-[#0C3B2E] text-white' 
                            : 'bg-[#FFFFE7] text-[#1F2C24] border border-[#D9D9D9]'
                        }`}
                      >
                        <GroupAddIcon fontSize="small" />
                        <span className="font-medium">
                          {isCollaborative ? 'Collaborative' : 'Make Collaborative'}
                        </span>
                      </button>
                    </div>
                    <p className="text-xs text-[#A0A0A0]">
                      {isCollaborative 
                        ? 'Others can add songs to this playlist. Requires public visibility on Spotify.' 
                        : 'Allow others to add songs to this playlist'}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => name.trim() && setStep(2)}
                    className="bg-[#0C3B2E] hover:bg-[#0a3328] text-[#F9F9F9]"
                    disabled={!name.trim()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-[#1F2C24]">
                    Add songs to your playlist
                  </h3>
                  
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#A0A0A0]">
                      <Music />
                    </div>
                    <Input
                      type="search"
                      placeholder="Search songs..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-10 py-5 rounded-xl bg-[#FFFFE7] border border-[#D9D9D9]"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="w-5 h-5 text-[#6D9773] animate-spin" />
                      </div>
                    )}
                  </div>

                  {searchError && (
                    <p className="text-red-500 text-sm">{searchError}</p>
                  )}

                  {/* Search Results */}
                  {searchQuery && searchResults.length > 0 && (
                    <div className="border rounded-lg p-3 bg-[#FFFFE7] border-[#D9D9D9] max-h-60 overflow-y-auto">
                      <div className="space-y-2">
                        {searchResults.map(track => (
                          <div
                            key={track.id}
                            className="flex items-center justify-between gap-3 p-3 hover:bg-[#FFFFD5] rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 relative overflow-hidden rounded-lg bg-gray-200 flex-shrink-0">
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
                            <button
                              onClick={() => addTrack(track)}
                              disabled={selectedTracks.some(t => t.id === track.id) || selectedTracks.length >= 200}
                              className="p-2 rounded-full bg-[#0C3B2E] text-white hover:bg-[#0a3328] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Tracks */}
                <div className="border-t border-[#D9D9D9] pt-4">
                  <h3 className="font-medium text-[#1F2C24] mb-3">
                    Selected Songs ({selectedTracks.length})
                  </h3>
                  
                  {selectedTracks.length === 0 ? (
                    <div className="text-center py-6 text-[#A0A0A0] border border-dashed border-[#D9D9D9] rounded-lg">
                      <Music className="w-12 h-12 mx-auto mb-2" />
                      <p>No songs added yet</p>
                    </div>
                  ) : (
                    <div className="border rounded-lg bg-[#FFFFE7] border-[#D9D9D9] max-h-60 overflow-y-auto">
                      <div className="space-y-2">
                        {selectedTracks.map(track => (
                          <div
                            key={track.id}
                            className="flex items-center justify-between gap-3 p-3 hover:bg-[#FFFFD5]"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 relative overflow-hidden rounded-lg bg-gray-200 flex-shrink-0">
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
                            <button
                              onClick={() => removeTrack(track.id)}
                              className="p-2 rounded-full text-[#A0A0A0] hover:bg-[#FFFFD5] hover:text-red-500"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="border-[#D9D9D9] text-[#1F2C24] hover:bg-[#FFFFD5]"
                  >
                    Back to Details
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-[#0C3B2E] hover:bg-[#0a3328] text-[#F9F9F9]"
                    disabled={isSubmitting || selectedTracks.length === 0}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </div>
                    ) : "Create Playlist"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;