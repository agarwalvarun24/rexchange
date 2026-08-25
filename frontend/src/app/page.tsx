// frontend/src/app/page.tsx
'use client';

import React from 'react';
import { ExchangeProvider, useExchange } from '../context/ExchangeContext';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import ListingCard from '../components/ListingCard';
import CreateListingModal from '../components/CreateListingModal';
import ItemDetailsModal from '../components/ItemDetailsModal';
import AuthModal from '../components/AuthModal';
import RequestBoard from '../components/RequestBoard';
import CreateRequestModal from '../components/CreateRequestModal';
import { Loader2, SearchX, Package, IndianRupee, Zap, ShieldCheck, PlusCircle, Megaphone } from 'lucide-react';

function HomeContent() {
  const {
    listings,
    requests,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    selectedCategory,
    searchQuery,
    transactionFilter,
    verifiedOnly,
    setSelectedCategory,
    setSearchQuery,
    setTransactionFilter,
    setVerifiedOnly,
    selectedCampus,
    openCreateRequestModal,
  } = useExchange();

  const clearFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setTransactionFilter(null);
    setVerifiedOnly(false);
  };

  const hasActiveFilters = selectedCategory || searchQuery || transactionFilter || verifiedOnly || selectedCampus !== 'All Campuses';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Exchange Gear, Notes & Skills Within Your Campus
          </h1>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
              <Package size={16} className="text-amber-300" />
              📦 180+ Items Traded
            </span>
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
              <IndianRupee size={16} className="text-green-300" />
              ₹3,40,000+ Saved by Students
            </span>
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
              <ShieldCheck size={16} className="text-blue-300" />
              100% Verified Campus Peers
            </span>
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
              <Zap size={16} className="text-yellow-300" />
              Avg. Meetup: Under 15 Mins
            </span>
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'marketplace'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🏷️ Available Marketplace
            <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              {listings.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'requests'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📢 Student Requests & Bounties
            <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              {requests.length}
            </span>
          </button>
        </div>
      </div>

      {/* Conditional Content */}
      {activeTab === 'marketplace' ? (
        <>
          <FilterBar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={40} className="animate-spin text-indigo-600" />
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-600">{error}</div>
            ) : listings.length === 0 ? (
              <div className="text-center py-20">
                <SearchX size={48} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No listings found</h3>
                <p className="text-gray-500 mb-4">
                  {hasActiveFilters ? 'Try adjusting your filters or search terms.' : 'Be the first to post something!'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </main>
        </>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-end mb-4">
            <button
              onClick={openCreateRequestModal}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2 rounded-full transition-colors shadow-md"
            >
              <PlusCircle size={18} />
              Post a Request
            </button>
          </div>
          <RequestBoard />
        </main>
      )}

      {/* Modals */}
      <CreateListingModal />
      <ItemDetailsModal />
      <AuthModal />
      <CreateRequestModal />
    </div>
  );
}

export default function HomePage() {
  return (
    <ExchangeProvider>
      <HomeContent />
    </ExchangeProvider>
  );
}