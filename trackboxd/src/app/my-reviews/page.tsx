"use client";

import React, { useState } from "react";
import { 
  Star, 
  Music, 
  Album, 
  ChevronDown,
  Pencil,
  Trash2
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Review {
  id: string;
  type: "song" | "album";
  title: string;
  artist: string;
  coverArt: string;
  rating: number;
  content: string;
  date: string;
  timestamp: string;
}

const ReviewsPage = () => {
  const [activeTab, setActiveTab] = useState<"all" | "songs" | "albums">("all");
  
  // Mock review data
  const reviews: Review[] = [
    {
      id: "1",
      type: "song",
      title: "Blinding Lights",
      artist: "The Weeknd",
      coverArt: "https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png",
      rating: 4.5,
      content: "An absolute masterpiece that captures the essence of 80s synthwave while feeling completely modern. The production is immaculate.",
      date: "May 15, 2023",
      timestamp: "2 days ago"
    },
    {
      id: "2",
      type: "album",
      title: "After Hours",
      artist: "The Weeknd",
      coverArt: "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png",
      rating: 4.0,
      content: "Solid album with great production values and emotional depth. While not every track is a hit, the highs are incredibly high.",
      date: "May 12, 2023",
      timestamp: "5 days ago"
    },
    {
      id: "3",
      type: "song",
      title: "Save Your Tears",
      artist: "The Weeknd",
      coverArt: "https://upload.wikimedia.org/wikipedia/en/8/8b/The_Weeknd_-_Save_Your_Tears.png",
      rating: 4.0,
      content: "Catchy chorus and smooth production make this a standout track. The Weeknd's vocals shine throughout.",
      date: "May 10, 2023",
      timestamp: "1 week ago"
    },
    {
      id: "4",
      type: "album",
      title: "folklore",
      artist: "Taylor Swift",
      coverArt: "https://upload.wikimedia.org/wikipedia/en/f/f8/Taylor_Swift_-_Folklore.png",
      rating: 5.0,
      content: "A stunning departure from her pop roots. Every song tells a story with beautiful lyricism and atmospheric production.",
      date: "May 5, 2023",
      timestamp: "2 weeks ago"
    },
    {
      id: "5",
      type: "song",
      title: "cardigan",
      artist: "Taylor Swift",
      coverArt: "https://upload.wikimedia.org/wikipedia/en/f/f8/Taylor_Swift_-_Folklore.png",
      rating: 4.5,
      content: "Hauntingly beautiful with poetic lyrics that linger long after the song ends. The production is minimalist perfection.",
      date: "May 4, 2023",
      timestamp: "2 weeks ago"
    }
  ];

  // Filter reviews based on active tab
  const filteredReviews = reviews.filter(review => {
    if (activeTab === "all") return true;
    return review.type === (activeTab === "songs" ? "song" : activeTab === "albums" ? "album" : activeTab);
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="relative">
            <div className="w-5 h-5 text-[#D9D9D9]">★</div>
            <div
              className="absolute top-0 left-0 w-5 h-5 text-[#FFBA00] overflow-hidden"
              style={{ width: `${Math.max(0, Math.min(1, rating - star + 1)) * 100}%` }}
            >
              ★
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFFF0]">
      <Header />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-8 h-8 text-[#FFBA00]" />
            <h1 className="text-3xl font-bold text-[#0C3B2E]">
              Your Reviews
            </h1>
          </div>
          <p className="text-[#0C3B2E]/70">
            All the songs and albums you've reviewed
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 border-b border-[#D9D9D9]">
          <button
            className={`px-4 py-2 font-medium ${activeTab === "all" ? "text-[#0C3B2E] border-b-2 border-[#0C3B2E]" : "text-[#A0A0A0]"}`}
            onClick={() => setActiveTab("all")}
          >
            All Reviews
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "songs" ? "text-[#0C3B2E] border-b-2 border-[#0C3B2E]" : "text-[#A0A0A0]"}`}
            onClick={() => setActiveTab("songs")}
          >
            Songs
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "albums" ? "text-[#0C3B2E] border-b-2 border-[#0C3B2E]" : "text-[#A0A0A0]"}`}
            onClick={() => setActiveTab("albums")}
          >
            Albums
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-lg p-8 max-w-md mx-auto">
                <Star className="w-12 h-12 text-[#FFBA00] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#0C3B2E] mb-2">No Reviews Yet</h3>
                <p className="text-[#0C3B2E]/70 mb-4">
                  You haven't reviewed any {activeTab === "all" ? "items" : activeTab} yet.
                </p>
                <Button className="bg-[#0C3B2E] hover:bg-[#1F2C24]">
                  Write Your First Review
                </Button>
              </div>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <div 
                key={review.id} 
                className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Cover Art */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img
                          src={review.coverArt}
                          alt={review.title}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-[#FFBA00] text-[#1F2C24] rounded-full p-1">
                          {review.type === "song" ? (
                            <Music className="w-4 h-4" />
                          ) : (
                            <Album className="w-4 h-4" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Review Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-[#0C3B2E] text-lg">{review.title}</h3>
                          <p className="text-[#6D9773]">{review.artist}</p>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-[#A0A0A0] hover:text-[#0C3B2E]">
                              <ChevronDown className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-[#FFFFF0] border border-[#D9D9D9] w-40">
                            <DropdownMenuItem className="cursor-pointer hover:bg-[#F2F3EF]">
                              <Pencil className="w-4 h-4 mr-2 text-[#6D9773]" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer hover:bg-[#F2F3EF] text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="mt-2">
                        {renderStars(review.rating)}
                      </div>
                      
                      <p className="mt-3 text-[#1F2C24] whitespace-pre-line">
                        {review.content}
                      </p>
                      
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-[#A0A0A0]">
                          Reviewed {review.date}
                        </span>
                        <span className="text-xs text-[#A0A0A0] bg-[#FFFFE7] px-2 py-1 rounded">
                          {review.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <Footer variant="light" />
    </div>
  );
};

export default ReviewsPage;