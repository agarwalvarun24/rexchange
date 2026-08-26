'use client';

import React from 'react';
import { ExchangeProvider, useExchange } from '../context/ExchangeContext';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import ListingCard from '../components/ListingCard';
import RequestBoard from '../components/RequestBoard';
import CreateListingModal from '../components/CreateListingModal';
import CreateRequestModal from '../components/CreateRequestModal';
import ItemDetailsModal from '../components/ItemDetailsModal';
import AuthModal from '../components/AuthModal';
import { Package, TrendingUp, ShieldCheck, Zap, Sparkles, Inbox } from 'lucide-react';

function HomeContent() {
  const {
    listings,
    requests,
    activeTab,
    setActiveTab,
    selectedCampus,
    selectedCategory,
    openCreateModal
  } = useExchange();

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      {/* Hero Section with Ambient Glow */}
      <section className="relative overflow-hidden hero-glow pt-8 pb-10 border-b border-slate-200/60 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Campus Circular Economy</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trade Gear, Notes & Skills with <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Verified Peers</span>
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Save money and reduce campus waste. Swap textbooks, borrow exam tools, and trade tutoring hours within your college community.
            </p>
          </div>

          {/* Metric Cards Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mt-7">
            <div className="glass-card dark:bg-slate-900/80 dark:border-slate-800 p-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-black text-slate-900 dark:text-white">180+</p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Items Exchanged</p>
              </div>
            </div>

            <div className="glass-card dark:bg-slate-900/80 dark:border-slate-800 p-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">₹3.4L+</p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Student Savings</p>
              </div>
            </div>

            <div className="glass-card dark:bg-slate-900/80 dark:border-slate-800 p-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-black text-purple-600 dark:text-purple-400">100%</p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Verified Students</p>
              </div>
            </div>

            <div className="glass-card dark:bg-slate-900/80 dark:border-slate-800 p-3.5 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-black text-slate-900 dark:text-white">&lt; 15m</p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Avg. Campus Meetup</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Navigation Tabs Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl shadow-inner">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🏷️ Available Marketplace</span>
              <span className="px-2 py-0.5 text-[10px] font-black bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full">
                {listings.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'requests'
                  ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>📢 Student Requests (Wanted)</span>
              <span className="px-2 py-0.5 text-[10px] font-black bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-full">
                {requests.length}
              </span>
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing results for <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCampus}</span>
          </div>
        </div>

        {/* View 1: Marketplace Listings */}
        {activeTab === 'marketplace' ? (
          <div className="space-y-6">
            <FilterBar />

            {listings.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                  <Inbox className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">No items found in this category</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                  Be the first student to post an item in {selectedCategory} for {selectedCampus}!
                </p>
                <button
                  onClick={openCreateModal}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md transition-all"
                >
                  + Post This Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {listings.map((item) => (
                  <ListingCard key={item.id} listing={item} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* View 2: Student Requests Board */
          <RequestBoard />
        )}

      </main>

      {/* Modals */}
      <CreateListingModal />
      <CreateRequestModal />
      <ItemDetailsModal />
      <AuthModal />
    </div>
  );
}

export default function Home() {
  return (
    <ExchangeProvider>
      <HomeContent />
    </ExchangeProvider>
  );
}