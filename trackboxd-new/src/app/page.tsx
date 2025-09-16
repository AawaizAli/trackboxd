"use client"

import React, { useState } from 'react';
import { Music, X } from 'lucide-react';
import Footer from '@/components/Footer';
import { signIn } from "next-auth/react";
import Image from "next/image";

const LANDING_CALLBACK_URL =
  process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/activity`
    : "/activity";

const LandingPage = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with:', { email, password });
    // Close modal after login attempt
    setShowLoginModal(false);
  };

  return (
    <div className="min-h-screen max-h-screen bg-[#FFFBEb] flex flex-col relative overflow-hidden">
      {/* Header with Spotify login (for development) */}
      <div className="absolute top-6 right-6 z-20">
        <button
          className="text-sm text-[#5C5537]/70 hover:text-[#5C5537] transition-colors"
          onClick={() => signIn("spotify", { callbackUrl: LANDING_CALLBACK_URL })}
        >
          Spotify Login
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Logo Section - Updated to center logo above text */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-32 h-32 mb-6">
            <Image 
              src="/logo.svg" 
              alt="Trackboxd Logo" 
              layout="fill"
              objectFit="contain"
            />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-[#5C5537] mb-4">
            Trackboxd
          </h1>
          
          <div className="text-center">
            <p className="text-xl text-[#5C5537]/70 mb-10 max-w-md">
              Your music, your words.
            </p>
            
            <div className="h-px w-48 bg-[#5C5537]/20 mx-auto mb-10"></div>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="animate-fade-in-up">
          <button
            className="text-lg text-[#5C5537] hover:text-[#3E3725] transition-colors font-medium px-6 py-3 rounded-md hover:bg-[#5C5537]/5"
            onClick={() => setShowLoginModal(true)}
          >
            Begin Your Journey →
          </button>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#5C5537]/20"
            onClick={() => setShowLoginModal(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="bg-[#FFFBEb] rounded-lg p-8 w-full max-w-md border border-[#5C5537]/20 shadow-lg relative z-10">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-[#5C5537]/50 hover:text-[#5C5537]"
              onClick={() => setShowLoginModal(false)}
            >
              <X size={20} />
            </button>
            
            {/* Modal Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#5C5537]">Welcome Back</h2>
              <p className="text-[#5C5537]/70 mt-2">Sign in to your account</p>
            </div>
            
            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#5C5537] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-[#5C5537]/20 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5C5537]/50 bg-white"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#5C5537] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-[#5C5537]/20 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5C5537]/50 bg-white"
                  required
                />
                
                <div className="text-right mt-2">
                  <a href="#" className="text-sm text-[#5C5537]/70 hover:text-[#5C5537]">
                    Forgot password?
                  </a>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-[#5C5537] text-white py-2 px-4 rounded-md hover:bg-[#3E3725] transition-colors"
              >
                Sign In
              </button>
            </form>
            
            {/* Create Account Option */}
            <div className="text-center mt-6 pt-6 border-t border-[#5C5537]/10">
              <p className="text-[#5C5537]/70">
                Don't have an account?{' '}
                <a href="#" className="text-[#5C5537] hover:underline font-medium">
                  Create one
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

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
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          animation-delay: 0.3s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;