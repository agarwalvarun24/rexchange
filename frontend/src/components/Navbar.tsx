'use client';

import React, { useState } from 'react';
import { Search, PlusCircle, ShieldCheck, MapPin, ChevronDown, LogOut, Sparkles, Sun, Moon } from 'lucide-react';
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
    logout,
    darkMode,
    toggleDarkMode
  } = useExchange();

  const [campusDropdownOpen, setCampusDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Logo & Campus Selector */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">RExchange</span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 rounded-md border border-indigo-100 dark:border-indigo-900">
                    CAMPUS
                  </span>
                </div>
              </div>
            </div>

            {/* Campus Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCampusDropdownOpen(!campusDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100/90 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-full border border-slate-200/60 dark:border-slate-700 transition-all shadow-sm"
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="max-w-[120px] sm:max-w-none truncate">{selectedCampus}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {campusDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Switch Campus Zone
                  </div>
                  {CAMPUSES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setSelectedCampus(c);
                        setCampusDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-indigo-50/60 dark:hover:bg-slate-700 transition-colors ${
                        selectedCampus === c ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/80 dark:bg-slate-700' : 'text-slate-700 dark:text-slate-200 font-medium'
                      }`}
                    >
                      <span>{c}</span>
                      {selectedCampus === c && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
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
                placeholder="Search textbooks, graphing calculators, lab manuals..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100/70 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            
            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-full shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Listing</span>
            </button>

            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-700 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <span>{currentUser.name}</span>
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-bold text-slate-800 dark:text-white">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                      <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">{currentUser.major}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 font-semibold rounded-lg flex items-center gap-2 mt-1 transition-colors"
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
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-800 rounded-full shadow-sm transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Verify Student ID</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}