"use client";

import React, { useState } from "react";
import { Search, Grid, List, Heart, Star, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Playlist {
  id: string;
  title: string;
  creator: string;
  coverArt: string;
  followers: number;
  tracks: number;
  description: string;
  isLiked: boolean;
  tags: string[];
}

const Playlists = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSort, setSelectedSort] = useState("Most Popular");

  // Mock data
  const popularPlaylists: Playlist[] = [
    {
      id: "1",
      title: "Summer Vibes 2024",
      creator: "Music Weekly",
      coverArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=600&fit=crop",
      followers: 12470,
      tracks: 32,
      description: "The hottest tracks for your summer adventures. Perfect for beach parties and road trips.",
      isLiked: true,
      tags: ["Summer", "Pop", "Dance"],
    },
    {
      id: "2",
      title: "Deep Focus: Concentration Flow",
      creator: "Chill Masters",
      coverArt: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=600&fit=crop",
      followers: 8920,
      tracks: 45,
      description: "Instrumental tracks to help you focus and boost productivity. Ideal for studying or working.",
      isLiked: false,
      tags: ["Study", "Lo-fi", "Instrumental"],
    },
    {
      id: "3",
      title: "Throwback 90s Hip Hop Essentials",
      creator: "Hip Hop Classics",
      coverArt: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=600&fit=crop",
      followers: 15680,
      tracks: 28,
      description: "Classic hip hop tracks from the golden era of 90s rap. Nostalgic beats and iconic lyrics.",
      isLiked: true,
      tags: ["Hip Hop", "90s", "Rap"],
    },
  ];

  const recentlyLikedPlaylists: Playlist[] = [
    {
      id: "4",
      title: "Indie Folk & Acoustic Sessions for Cozy Evenings by the Fireplace",
      creator: "Folk Collective",
      coverArt: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=300&fit=crop",
      followers: 4210,
      tracks: 22,
      description: "Gentle acoustic melodies and heartfelt lyrics perfect for relaxing evenings, rainy days, or quiet moments of reflection. Features emerging artists and hidden gems from the folk scene.",
      isLiked: true,
      tags: ["Folk", "Acoustic", "Chill"],
    },
    {
      id: "5",
      title: "Electronic Dance Anthems 2024: Festival Ready Mix",
      creator: "EDM Nation",
      coverArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
      followers: 18760,
      tracks: 36,
      description: "The biggest electronic dance tracks of 2024. Perfect for parties, workouts, or getting pumped up. Features the latest from top DJs and producers.",
      isLiked: true,
      tags: ["EDM", "Dance", "Party"],
    },
    {
      id: "6",
      title: "Jazz Classics: From Miles to Coltrane",
      creator: "Jazz Archives",
      coverArt: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop",
      followers: 6780,
      tracks: 24,
      description: "Timeless jazz masterpieces from the legends of the genre. Perfect for sophisticated gatherings or relaxed evenings with a glass of wine.",
      isLiked: false,
      tags: ["Jazz", "Classic", "Instrumental"],
    },
    {
      id: "7",
      title: "Work From Home Productivity: Focus & Motivation",
      creator: "Productivity Hub",
      coverArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
      followers: 9320,
      tracks: 40,
      description: "Curated selection of ambient and instrumental tracks designed to enhance concentration and maintain energy levels during work hours without distracting lyrics.",
      isLiked: true,
      tags: ["Work", "Focus", "Ambient"],
    },
    {
      id: "8",
      title: "Rock Legends: The Ultimate Collection of Iconic Guitar Riffs and Powerful Vocals from the 70s and 80s",
      creator: "Rock Classics",
      coverArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
      followers: 24500,
      tracks: 50,
      description: "The most influential rock tracks from legendary bands that defined generations. Features Queen, Led Zeppelin, The Rolling Stones, AC/DC, and more.",
      isLiked: true,
      tags: ["Rock", "Classic", "70s", "80s"],
    },
  ];

  const sortOptions = ["Most Popular", "Recently Added", "Most Tracks", "A-Z"];
  const tagOptions = ["All", "Chill", "Workout", "Study", "Party", "Road Trip"];

  return (
    <div className="min-h-screen bg-[#FFFFF0]">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#0C3B2E]">Playlists</h1>
              <p className="text-[#0C3B2E]/70 mt-2">
                Discover and organize your favorite music collections
              </p>
            </div>
            <button className="bg-[#FFBA00] text-[#1F2C24] px-4 py-3 rounded-lg font-bold hover:bg-[#FFBA00]/90 transition-colors flex items-center gap-2 shadow-md">
              <Plus className="w-5 h-5" />
              Create Playlist
            </button>
          </div>
        </div>

        {/* Popular This Week Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#0C3B2E]">
              <span className="text-[#FFBA00]">Popular</span> This Week
            </h2>
         
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularPlaylists.map((playlist) => (
              <div
                key={`popular-${playlist.id}`}
                className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="relative">
                  <img
                    src={playlist.coverArt}
                    alt={playlist.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-[#0C3B2E] truncate">
                        {playlist.title}
                      </h3>
                      <p className="text-[#6D9773] text-sm">
                        by {playlist.creator}
                      </p>
                    </div>
                    <button
                      className={`p-2 rounded-full ${
                        playlist.isLiked
                          ? "text-[#FF3C57]"
                          : "text-[#A0A0A0] hover:text-[#FF3C57]"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          playlist.isLiked ? "fill-[#FF3C57]" : ""
                        }`}
                      />
                    </button>
                  </div>
                  
                  <p className="text-[#1F2C24] text-sm mb-4 line-clamp-2">
                    {playlist.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-[#A0A0A0] text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{playlist.tracks} tracks</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#A0A0A0] text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <span>{playlist.followers.toLocaleString()} saves </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
            {recentlyLikedPlaylists.map((playlist, index) => (
              <div
                key={`liked-${playlist.id}`}
                className={`p-4 hover:bg-[#F9F9F6] transition-colors ${
                  index < recentlyLikedPlaylists.length - 1
                    ? "border-b border-[#D9D9D9]"
                    : ""
                }`}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={playlist.coverArt}
                      alt={playlist.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-[#0C3B2E] truncate">
                        {playlist.title}
                      </h3>
                      <button
                        className={`p-1 ${
                          playlist.isLiked
                            ? "text-[#FF3C57]"
                            : "text-[#A0A0A0] hover:text-[#FF3C57]"
                        }`}
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            playlist.isLiked ? "fill-[#FF3C57]" : ""
                          }`}
                        />
                      </button>
                    </div>
                    
                    <p className="text-[#6D9773] text-sm mb-1">
                      by {playlist.creator}
                    </p>
                    
                    <p className="text-[#1F2C24] text-sm mb-2 line-clamp-2">
                      {playlist.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1 text-[#A0A0A0] text-xs">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          <span>{playlist.tracks} tracks</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#A0A0A0] text-xs">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                          <span>{playlist.followers.toLocaleString()} saves</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer variant="light" />
    </div>
  );
};

export default Playlists;