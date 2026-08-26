'use client';

import React, { useState } from 'react';
import { Search, PlusCircle, ShieldCheck, MapPin, ChevronDown, LogOut } from 'lucide-react';
import { useExchange, CAMPUSES } from '../context/ExchangeContext';

export default function Navbar() {
  const {
    selectedCampus,
    setSelectedCampus,
    searchQuery,
    setSearchQuery,
    openCreateModal,
    openAuthModal,
    currentUser,
    logout
  } = useExchange();

  const [campusDropdownOpen, setCampusDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Campus Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 cursor-pointer">
              <span className="px-2.5 py-1 text-sm font-black bg-indigo-600 text-white rounded-lg shadow-sm">
                REx
              </span>
              <span className="text-lg font-bold text-slate-800 tracking-tight">change</span>
              <span className="hidden sm:inline-block ml-1 px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                Campus Edition
              </span>
            </div>

            {/* Campus Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCampusDropdownOpen(!campusDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-full transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span className="max-w-[130px] sm:max-w-none truncate">{selectedCampus}</span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {campusDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase text-slate-400">
                    Select Campus Zone
                  </div>
                  {CAMPUSES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setSelectedCampus(c);
                        setCampusDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        selectedCampus === c ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{c}</span>
                      {selectedCampus === c && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search textbooks, electronics, notes, skills..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100/80 border border-slate-200 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Action Buttons & Auth */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-sm hover:shadow transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Listing</span>
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-100 hover:bg-slate-200/80 rounded-full transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <span>{currentUser.name}</span>
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-800">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
                      <p className="text-[10px] text-indigo-600 font-medium">{currentUser.major}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200/80 rounded-full transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Verify Student ID / Login</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}