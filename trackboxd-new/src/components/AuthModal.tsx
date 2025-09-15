// components/AuthModal.tsx
"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { signIn } from "next-auth/react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const LANDING_CALLBACK_URL = process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/activity`
    : "/activity";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      if (isLogin) {
        // Login logic
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
          callbackUrl: LANDING_CALLBACK_URL
        });

        if (result?.error) {
          setError('Invalid email or password');
        } else {
          onClose();
        }
      } else {
        // Signup logic
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        });

        if (response.ok) {
          // Auto-login after successful registration
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
            callbackUrl: LANDING_CALLBACK_URL
          });

          if (result?.error) {
            setError('Registration successful but login failed. Please try logging in.');
          } else {
            onClose();
          }
        } else {
          const data = await response.json();
          setError(data.error || 'Registration failed');
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#5C5537]/20"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="bg-[#FFFBEb] rounded-lg p-8 w-full max-w-md border border-[#5C5537]/20 shadow-lg relative z-10">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-[#5C5537]/50 hover:text-[#5C5537]"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        
        {/* Modal Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-[#5C5537]">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-[#5C5537]/70 mt-2">
            {isLogin ? 'Sign in to your account' : 'Join Trackboxd today'}
          </p>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#5C5537] mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-[#5C5537]/20 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5C5537]/50 bg-white"
                required
                minLength={3}
              />
            </div>
          )}
          
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
              minLength={6}
            />
          </div>
          
          {!isLogin && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#5C5537] mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-[#5C5537]/20 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5C5537]/50 bg-white"
                required
                minLength={6}
              />
            </div>
          )}
          
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          
          <button
            type="submit"
            className="w-full bg-[#5C5537] text-white py-2 px-4 rounded-md hover:bg-[#3E3725] transition-colors"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
     
        
      
        
        {/* Toggle between login/signup */}
        <div className="text-center mt-6 pt-6 border-t border-[#5C5537]/10">
          <p className="text-[#5C5537]/70">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#5C5537] hover:underline font-medium"
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;