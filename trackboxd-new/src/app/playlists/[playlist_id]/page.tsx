// app/playlists/[playlist_id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Grid, List, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import useUser from "@/hooks/useUser";
import { SpotifyTrack } from "../../songs/types";

interface Playlist {
  id: string;
  name: string;
  creator: string;
  cover_url: string;
  tracks: number;
  like_count: number;
  description: string;
  isLiked?: boolean;
}

interface PlaylistDetails {
  playlist: Playlist;
  items: SpotifyTrack[];
}

const formatDuration = (ms: number): string => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

const PlaylistDetailsPage = () => {
  const { playlist_id } = useParams();
  const [playlistDetails, setPlaylistDetails] = useState<PlaylistDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  
  const { user } = useUser();

  // Fetch playlist details
  useEffect(() => {
    const fetchPlaylistDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/playlists/${playlist_id}`);
        
        if (!res.ok) {
          throw new Error("Failed to fetch playlist details");
        }
        
        const data = await res.json();
        setPlaylistDetails(data);
      } catch (err) {
        setError((err as Error).message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistDetails();
  }, [playlist_id]);

  // Fetch like status
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!user || !playlistDetails) return;

      try {
        const res = await fetch(
          `/api/like/playlist?userId=${user.id}&playlistId=${playlistDetails.playlist.id}`
        );
        
        if (res.ok) {
          const data = await res.json();
          setIsLiked(data.isLiked);
        }
      } catch (error) {
        console.error("Failed to fetch like status", error);
      }
    };

    fetchLikeStatus();
  }, [user, playlistDetails]);

  // Handle like click
  const handleLikeClick = async () => {
    if (!user) {
      window.location.href = "/";
      return;
    }

    if (!playlistDetails) return;

    setLikeLoading(true);
    const newIsLiked = !isLiked;

    try {
      const method = newIsLiked ? "POST" : "DELETE";
      const res = await fetch("/api/like/playlist", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: user.id, 
          playlistId: playlistDetails.playlist.id 
        }),
      });

      if (res.ok) {
        setIsLiked(newIsLiked);
        // Update playlist like count
        setPlaylistDetails(prev => {
          if (!prev) return null;
          
          return {
            ...prev,
            playlist: {
              ...prev.playlist,
              like_count: prev.playlist.like_count + (newIsLiked ? 1 : -1)
            }
          };
        });
      }
    } catch (error) {
      console.error("Like operation failed:", error);
    } finally {
      setLikeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFF0]">
        <Header />
        <div className="max-w-5xl mx-auto px-4 py-8 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6D9773]"></div>
        </div>
        <Footer variant="light" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFFF0]">
        <Header />
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
        <Footer variant="light" />
      </div>
    );
  }

  if (!playlistDetails) {
    return (
      <div className="min-h-screen bg-[#FFFFF0]">
        <Header />
        <div className="max-w-5xl mx-auto px-4 py-8 text-center">
          <p>Playlist not found</p>
        </div>
        <Footer variant="light" />
      </div>
    );
  }

  const { playlist, items } = playlistDetails;

  return (
    <div className="min-h-screen bg-[#FFFFF0]">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Playlist Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="w-56 h-56 relative overflow-hidden rounded-xl shadow border border-[#D9D9D9]">
              <img
                src={playlist.cover_url || "/default-playlist.jpg"}
                alt={`${playlist.name} cover`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="w-full md:w-2/3">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0C3B2E] mb-1">
              {playlist.name}
            </h1>
            <p className="text-lg text-[#6D9773] mb-4">
              By {playlist.creator}
            </p>

            <p className="text-sm text-[#1F2C24] mb-6 line-clamp-3">
              {playlist.description || "No description available"}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4 text-[#6D9773]" />
                <span className="text-sm text-[#1F2C24]">
                  {playlist.like_count} likes
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span className="text-sm text-[#1F2C24]">
                  {playlist.tracks} tracks
                </span>
              </div>
              
              <button
                onClick={handleLikeClick}
                disabled={likeLoading}
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors cursor-pointer ${
                  isLiked
                    ? "bg-[#FFBA00] text-[#1F2C24]"
                    : "bg-[#6D9773] text-[#F9F9F9] hover:bg-[#5C8769]"
                }`}>
                {likeLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Heart className="w-3 h-3" />
                    <span>{isLiked ? "Liked" : "Like"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center space-x-2 bg-[#FFFFF5] rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid" ? "bg-[#6D9773] text-white" : "text-[#1F2C24]"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${
                viewMode === "list" ? "bg-[#6D9773] text-white" : "text-[#1F2C24]"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tracks Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#0C3B2E] mb-4">
            Tracks ({items.length})
          </h2>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((track, index) => (
                <div
                  key={track.id}
                  className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={track.album.images[0]?.url || "/default-album.png"}
                      alt={track.album.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm text-[#1F2C24] line-clamp-1">
                        {track.name}
                      </p>
                      <p className="text-xs text-[#6D9773] mt-1">
                        {track.artists.map(a => a.name).join(", ")}
                      </p>
                      <p className="text-xs text-[#A0A0A0] mt-1">
                        {formatDuration(track.duration_ms)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-xl overflow-hidden">
              {items.map((track, index) => (
                <div
                  key={track.id}
                  className={`flex items-center p-4 ${
                    index < items.length - 1 ? "border-b border-[#D9D9D9]" : ""
                  }`}
                >
                  <span className="text-sm text-[#A0A0A0] w-8">{index + 1}</span>
                  <img
                    src={track.album.images[0]?.url || "/default-album.png"}
                    alt={track.album.name}
                    className="w-12 h-12 rounded object-cover mr-3"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-[#1F2C24] truncate">
                      {track.name}
                    </p>
                    <p className="text-xs text-[#6D9773] truncate">
                      {track.artists.map(a => a.name).join(", ")}
                    </p>
                  </div>
                  <p className="text-xs text-[#A0A0A0] ml-2">
                    {formatDuration(track.duration_ms)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer variant="light" />
    </div>
  );
};

export default PlaylistDetailsPage;