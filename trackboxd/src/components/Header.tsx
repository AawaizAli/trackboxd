"use client";

import React, { useState } from 'react';
import { Search, ChevronDown, Music, Users, Settings, LogOut, BookOpen, MessageSquare, FileText, Menu, X } from 'lucide-react';

interface HeaderProps {
  user?: {
    name: string;
    avatar?: string;
    username: string;
  };
}

const Header: React.FC<HeaderProps> = ({ 
  user = { 
    name: "Iznah Waqar", 
    avatar: undefined, 
    username: "iznauurr" 
  } 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { label: 'Activity', href: '/activity', active: false },
    { label: 'Songs', href: '/songs', active: false },
    { label: 'Playlists', href: '/playlists', active: false },
  ];

  const dropdownItems = [
    { label: 'My Songs', href: '/my-songs', icon: Music },
    { label: 'My Playlists', href: '/my-playlists', icon: Users },
    { label: 'My Reviews', href: '/my-reviews', icon: MessageSquare },
    { label: 'My Annotations', href: '/my-annotations', icon: FileText },
    { type: 'divider' },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Logout', href: '/logout', icon: LogOut },
  ];

  return (
    <header className="bg-[#FFFFE7] border-b border-[#D9D9D9] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left - Logo and Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#1F2C24] tracking-tight">
                Trackboxd
              </h1>
            </div>
          </div>

          {/* Middle - Navigation (desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  item.active
                    ? 'bg-[#0C3B2E] text-[#F9F9F9]'
                    : 'text-[#1F2C24] hover:bg-[#FFFFD5] hover:text-[#1F2C24]'
                }`}
              >
                {item.label}
              </a>
            ))}
            <button className="p-2 rounded-lg text-[#1F2C24] hover:bg-[#FFFFD5] transition-colors duration-200 ml-2">
              <Search className="w-5 h-5" />
            </button>
          </nav>

          {/* Right - User Section (desktop) */}
          <div className="hidden md:block relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#FFFFD5] transition-colors duration-200"
            >
              {/* User Avatar */}
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-[#0C3B2E] flex items-center justify-center ring-2 ring-[#FFBA00]">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-[#F9F9F9] text-sm font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              
              <span className="text-sm font-medium text-[#1F2C24]">
                {user.username}
              </span>
              
              <ChevronDown className={`w-4 h-4 text-[#A0A0A0] transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                {/* Backdrop for mobile */}
                <div 
                  className="fixed inset-0 z-10 md:hidden" 
                  onClick={() => setIsDropdownOpen(false)}
                />
                
                {/* Dropdown Content - FIXED POSITIONING */}
                <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-1/25 top-full mt-2 w-56 bg-[#FFFFF0] rounded-xl shadow-lg border border-[#D9D9D9] py-2 z-20">
                  {dropdownItems.map((item, index) => (
                    item.type === 'divider' ? (
                      <div key={index} className="h-px bg-[#D9D9D9] my-2" />
                    ) : (
                      <a
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-[#1F2C24] hover:bg-[#F2F3EF] transition-colors duration-200"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        {item.icon && <item.icon className="w-4 h-4 text-[#A0A0A0]" />}
                        {item.label}
                      </a>
                    )
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button className="p-2 rounded-lg text-[#1F2C24] hover:bg-[#F2F3EF] transition-colors duration-200">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-[#1F2C24] hover:bg-[#F2F3EF] transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          {/* Navigation */}
          <div className="px-4 py-3">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`px-3 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                    item.active
                      ? 'bg-[#0C3B2E] text-[#F9F9F9]'
                      : 'text-[#1F2C24] hover:bg-[#F2F3EF]'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          
          {/* User Section */}
          <div className="border-t border-[#D9D9D9] px-4 py-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#0C3B2E] flex items-center justify-center ring-2 ring-[#FFBA00]">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-[#F9F9F9] text-base font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <div className="font-medium text-[#1F2C24]">{user.name}</div>
                <div className="text-sm text-[#A0A0A0]">@{user.username}</div>
              </div>
            </div>
            
            {/* Dropdown Menu */}
            <div className="flex flex-col gap-1">
              {dropdownItems.map((item, index) => (
                item.type === 'divider' ? (
                  <div key={index} className="h-px bg-[#D9D9D9] my-2" />
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-3 text-base text-[#1F2C24] hover:bg-[#F2F3EF] transition-colors duration-200 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon && <item.icon className="w-5 h-5 text-[#A0A0A0]" />}
                    {item.label}
                  </a>
                )
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;