"use client"

import React from 'react';
import { Music, Star, List, Share2, ChevronDown } from 'lucide-react';
import Footer from '@/components/Footer';
import { signIn } from "next-auth/react";
import Image from "next/image";

const LANDING_CALLBACK_URL =
  process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/activity`
    : "/activity";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFFE7] via-[#FFFFF0] to-[#FFFFD5] flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Blobs */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-[#FFBA00]/10 rounded-full mix-blend-multiply blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-[#0C3B2E]/10 rounded-full mix-blend-multiply blur-3xl"></div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-16 animate-fade-in">
          <div className="relative w-40 h-40 mb-8">
            <Image 
              src="/logo1.svg" 
              alt="Trackboxd Logo" 
              layout="fill"
              objectFit="contain"
            />
          </div>
          
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-[#0C3B2E] mb-2 tracking-tight">
              Trackboxd
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-[#0C3B2E] to-[#1F2C24] mx-auto rounded-full mt-4"></div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-2xl text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-5xl font-bold text-[#0C3B2E] mb-6 leading-tight">
            Your music, <span className="text-[#FFBA00]">your words</span>.
          </h2>
          <p className="text-xl md:text-2xl text-[#1F2C24]/80 mb-12 leading-relaxed font-light max-w-2xl">
            Track the songs you listen to. Save those you want to hear. 
            Tell your friends what's good. All in one beautiful space.
          </p>
          
          {/* Spotify Login Button */}
          <button
            className="inline-flex items-center gap-4 bg-gradient-to-r from-[#1DB954] to-[#1ED760] text-[#F9F9F9] font-semibold text-lg md:text-xl px-8 md:px-12 py-4 md:py-5 rounded-xl transition-all duration-300 shadow-lg group hover:shadow-xl"
            onClick={() => signIn("spotify", { callbackUrl: LANDING_CALLBACK_URL })}
          >
            <svg 
              role="img" 
              viewBox="0 0 24 24" 
              className="w-6 h-6 md:w-7 md:h-7 fill-[#F9F9F9]"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              Log in with Spotify
            </span>
          </button>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-[#1F2C24] text-base md:text-lg mb-8 max-w-5xl animate-fade-in">
          {[
            { icon: <Music className="w-8 h-8 text-[#FFBA00]" />, text: "Track songs" },
            { icon: <Star className="w-8 h-8 text-[#FFBA00]" />, text: "Write reviews" },
            { icon: <List className="w-8 h-8 text-[#FFBA00]" />, text: "Create playlists" },
            { icon: <Share2 className="w-8 h-8 text-[#FFBA00]" />, text: "Share with friends" },
          ].map((feature, index) => (
            <div 
              key={index} 
              className="bg-[#FFFFF0] backdrop-blur-sm p-6 rounded-2xl border border-[#FFBA00]/30 hover:border-[#0C3B2E] transition-all duration-300 hover:-translate-y-1 shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="bg-[#FFBA00]/10 p-3 rounded-xl">
                  {feature.icon}
                </div>
                <span className="font-medium">{feature.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-[#FFFFE7] w-full">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#0C3B2E] text-center mb-16">
            How Trackboxd Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                step: "1", 
                title: "Connect Spotify", 
                description: "Log in with your Spotify account to access your music library and listening history."
              },
              { 
                step: "2", 
                title: "Track & Review", 
                description: "Log songs you listen to, rate them, and write detailed reviews with tags."
              },
              { 
                step: "3", 
                title: "Share & Discover", 
                description: "Follow friends, share your activity, and discover new music through your network."
              }
            ].map((item, index) => (
              <div key={index} className="bg-[#FFFFF0] p-8 rounded-2xl border border-[#FFBA00]/20 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#FFBA00] flex items-center justify-center text-[#1F2C24] font-bold text-xl mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-[#0C3B2E] mb-3">{item.title}</h3>
                <p className="text-[#1F2C24]/80">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer variant="light" />
      
      {/* Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          animation-delay: 0.3s;
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;