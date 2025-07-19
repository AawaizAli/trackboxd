"use client";

import React from "react";
import { 
  MessageCircle, 
  Clock,
  ChevronDown,
  Pencil,
  Trash2,
  Heart
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

interface Annotation {
  id: string;
  song: string;
  artist: string;
  album: string;
  coverArt: string;
  timestamp: string;
  comment: string;
  date: string;
  relativeTime: string;
  likes: number;
}

const AnnotationsPage = () => {
  const annotations: Annotation[] = [
    {
      id: "1",
      song: "Blinding Lights",
      artist: "The Weeknd",
      album: "After Hours",
      coverArt: "https://upload.wikimedia.org/wikipedia/en/e/e6/The_Weeknd_-_Blinding_Lights.png",
      timestamp: "2:45",
      comment: "This synth line is pure 80s nostalgia. The way it builds tension before the chorus is masterful.",
      date: "May 15, 2023",
      relativeTime: "2 days ago",
      likes: 24
    },
    {
      id: "2",
      song: "Save Your Tears",
      artist: "The Weeknd",
      album: "After Hours",
      coverArt: "https://upload.wikimedia.org/wikipedia/en/8/8b/The_Weeknd_-_Save_Your_Tears.png",
      timestamp: "1:30",
      comment: "The vocal harmonies here are incredible. Notice how the layered vocals create a dreamy atmosphere.",
      date: "May 12, 2023",
      relativeTime: "5 days ago",
      likes: 18
    },
    {
      id: "3",
      song: "cardigan",
      artist: "Taylor Swift",
      album: "folklore",
      coverArt: "https://upload.wikimedia.org/wikipedia/en/f/f8/Taylor_Swift_-_Folklore.png",
      timestamp: "3:15",
      comment: "The lyric 'chase two girls, lose the one' is such a poignant reflection on regret and lost love.",
      date: "May 10, 2023",
      relativeTime: "1 week ago",
      likes: 42
    },
    {
      id: "4",
      song: "august",
      artist: "Taylor Swift",
      album: "folklore",
      coverArt: "https://upload.wikimedia.org/wikipedia/en/f/f8/Taylor_Swift_-_Folklore.png",
      timestamp: "0:45",
      comment: "The bass line that comes in here perfectly captures the nostalgic summer vibe of the song.",
      date: "May 8, 2023",
      relativeTime: "1 week ago",
      likes: 31
    },
    {
      id: "5",
      song: "Levitating",
      artist: "Dua Lipa",
      album: "Future Nostalgia",
      coverArt: "https://upload.wikimedia.org/wikipedia/en/c/c3/Tyler%2C_the_Creator_-_Flower_Boy.png",
      timestamp: "1:10",
      comment: "The funky guitar riff that kicks in here is pure disco perfection. Impossible not to dance!",
      date: "May 5, 2023",
      relativeTime: "2 weeks ago",
      likes: 29
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFFF0]">
      <Header />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-8 h-8 text-[#6D9773]" />
            <h1 className="text-3xl font-bold text-[#0C3B2E]">
              Your Annotations
            </h1>
          </div>
          <p className="text-[#0C3B2E]/70">
            Insights and comments you've added to songs
          </p>
        </div>

        {/* Annotations List */}
        <div className="space-y-6">
          {annotations.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-lg p-8 max-w-md mx-auto">
                <MessageCircle className="w-12 h-12 text-[#6D9773] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#0C3B2E] mb-2">No Annotations Yet</h3>
                <p className="text-[#0C3B2E]/70 mb-4">
                  You haven't added any annotations to songs yet.
                </p>
                <Button className="bg-[#0C3B2E] hover:bg-[#1F2C24]">
                  Add Your First Annotation
                </Button>
              </div>
            </div>
          ) : (
            annotations.map((annotation) => (
              <div 
                key={annotation.id} 
                className="bg-[#FFFFF5] border border-[#D9D9D9] rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Cover Art */}
                    <div className="flex-shrink-0">
                      <img
                        src={annotation.coverArt}
                        alt={annotation.song}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    </div>
                    
                    {/* Annotation Content */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-[#0C3B2E] text-lg">
                            {annotation.song}
                          </h3>
                          <p className="text-[#6D9773]">
                            {annotation.artist} • {annotation.album}
                          </p>
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
                      
                      {/* Timestamp Section */}
                      <div className="mt-3 flex items-center gap-2 bg-[#FFFFE7] px-3 py-2 rounded-lg w-fit">
                        <Clock className="w-4 h-4 text-[#A0A0A0]" />
                        <span className="font-mono font-medium text-[#0C3B2E]">
                          {annotation.timestamp}
                        </span>
                      </div>
                      
                      {/* Comment */}
                      <div className="mt-4 bg-[#FFFFE7]/50 border-l-4 border-[#6D9773] pl-4 py-2 rounded-r">
                        <p className="text-[#1F2C24] whitespace-pre-line">
                          {annotation.comment}
                        </p>
                      </div>
                      
                      {/* Metadata */}
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-2 text-sm text-[#A0A0A0]">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {annotation.likes} likes
                          </span>
                        </div>
                        
                        <span className="text-xs text-[#A0A0A0]">
                          {annotation.date} • {annotation.relativeTime}
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

export default AnnotationsPage;