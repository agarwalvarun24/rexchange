'use client';

import React from 'react';
import { Listing } from '../types';
import { useExchange } from '../context/ExchangeContext';
import { MapPin, ArrowRight, Sparkles, Star, Edit3, Trash2 } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { openItemModal, openEditModal, deleteListing } = useExchange();

  const getBadgeStyle = () => {
    switch (listing.transactionType) {
      case 'free':
        return 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-black';
      case 'swap':
        return 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 font-bold';
      case 'skill_trade':
        return 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 font-bold';
      default:
        return 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800 font-black';
    }
  };

  const sellerInitial = listing.sellerName ? listing.sellerName.charAt(0) : 'S';
  const sellerRating = (4.5 + ((listing.id * 0.1) % 0.5)).toFixed(1);

  const fallbackImg = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  return (
    <div 
      onClick={() => openItemModal(listing)}
      className="group relative bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800/90 p-3.5 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* Product Image Thumbnail with Floating Badges */}
        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img 
            src={listing.imageUrl || fallbackImg} 
            alt={listing.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImg;
            }}
          />
          
          {/* Floating Transaction Badge */}
          <div className="absolute top-2.5 left-2.5">
            <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-lg border shadow-sm backdrop-blur-md ${getBadgeStyle()}`}>
              {listing.transactionType === 'sell' ? `FOR SALE • ₹${listing.price}` : listing.transactionType.replace('_', ' ')}
            </span>
          </div>

          {/* Edit & Delete Controls */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openEditModal(listing);
              }}
              title="Edit Listing"
              className="p-1.5 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg shadow-sm border border-slate-200/80 dark:border-slate-700 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm(`Are you sure you want to delete "${listing.title}"?`)) {
                  deleteListing(listing.id);
                }
              }}
              title="Delete Listing"
              className="p-1.5 bg-white/90 dark:bg-slate-800/90 hover:bg-red-50 dark:hover:bg-red-950/80 text-red-600 dark:text-red-400 rounded-lg shadow-sm border border-slate-200/80 dark:border-slate-700 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title, Category & Condition */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-md capitalize">
              {listing.category}
            </span>
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200/60 dark:border-slate-700">
              {listing.condition}
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {listing.title}
          </h3>
        </div>

        {/* Pricing / Swap Details */}
        <div>
          {listing.transactionType === 'free' ? (
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">FREE</span>
          ) : listing.transactionType === 'sell' ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-slate-900 dark:text-white">₹{listing.price}</span>
              <span className="text-[10px] text-slate-400 font-medium line-through">₹{Math.round((listing.price || 400) * 2.2)}</span>
            </div>
          ) : (
            <div className="p-2 bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 rounded-xl text-[11px] text-purple-900 dark:text-purple-300 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
              <span className="truncate"><strong>Wants:</strong> {listing.swapWants || 'Open for exchange'}</span>
            </div>
          )}
        </div>

        {/* Location Tag */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="truncate">{listing.locationTag || 'Campus Safe Zone'}</span>
        </div>
      </div>

      {/* Seller Credentials & CTA */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
              {sellerInitial}
            </div>
            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
              {listing.sellerName}
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{sellerRating}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="w-full py-2 px-3 text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50/80 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 border border-indigo-100 dark:border-slate-700"
        >
          <span>View Details & Offer</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}