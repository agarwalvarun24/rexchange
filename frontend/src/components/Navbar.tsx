// frontend/src/components/Navbar.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  MapPin,
  ShieldCheck,
  ChevronDown,
  Check,
  LogOut,
  Shield,
} from 'lucide-react';
import { useExchange, CAMPUSES } from '../context/ExchangeContext';

const Navbar = () => {
  const {
    searchQuery,
    setSearchQuery,
    openCreateModal,
    selectedCampus,
    setSelectedCampus,
    currentUser,
    openAuthModal,
    logout,
  } = useExchange();

  const [campusDropdownOpen, setCampusDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const campusRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Click-away handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (campusRef.current && !campusRef.current.contains(event.target as Node)) {
        setCampusDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo and campus selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg px-3 py-1.5 font-bold text-xl shadow-md">
                REx
              </div>
              <span className="font-semibold text-gray-800 text-lg">change</span>
              <span className="ml-1 bg-indigo-100 text-indigo-800 text-[11px] font-medium px-2 py-0.5 rounded-full">
                Campus Edition
              </span>
            </div>
            <div className="hidden md:block relative" ref={campusRef}>
              <button
                onClick={() => setCampusDropdownOpen(!campusDropdownOpen)}
                className="flex items-center gap-1.5 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 transition-colors shadow-sm"
              >
                <MapPin size={14} className="text-indigo-500" />
                <span>{selectedCampus}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {campusDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50 w-64">
                  {CAMPUSES.map((campus) => (
                    <button
                      key={campus}
                      onClick={() => {
                        setSelectedCampus(campus);
                        setCampusDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                    >
                      <span>{campus}</span>
                      {selectedCampus === campus && (
                        <Check size={16} className="text-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center: Search bar */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search textbooks, electronics, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right: Post button and auth/profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium text-sm px-4 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
            >
              <Plus size={16} />
              Post Listing
            </button>

            {currentUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shadow-md">
                      {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 text-green-500 bg-white rounded-full">
                      <ShieldCheck size={16} />
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-800 leading-tight">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 leading-tight">{currentUser.dorm}</p>
                  </div>
                  <ChevronDown size={16} className="text-gray-400" />
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50 w-48">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <p className="font-medium">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                      <p className="text-xs text-green-600 mt-1">✓ Verified Campus Trader</p>
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-4 py-2 rounded-full transition-colors shadow-md"
              >
                <Shield size={16} />
                Verify Student ID / Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;