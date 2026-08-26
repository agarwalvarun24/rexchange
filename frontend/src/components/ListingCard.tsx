'use client';

import React from 'react';
import { Listing } from '../types';
import { useExchange } from '../context/ExchangeContext';
import { MapPin, ShieldCheck, ArrowRight, Sparkles, Star } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { openItemModal } = useExchange();

  const getBadgeStyle = () => {
    switch (listing.transactionType) {
      case 'free':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-black';
      case 'swap':
        return 'bg-blue-50 text-blue-700 border-blue-200 font-bold';
      case 'skill_trade':
        return 'bg-purple-50 text-purple-700 border-purple-200 font-bold';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200 font-black';
    }
  };

  const sellerInitial = listing.sellerName ? listing.sellerName.charAt(0) : 'S';
  const sellerRating = (4.5 + ((listing.id * 0.1) % 0.5)).toFixed(1);

  return (
    <div 
      onClick={() => openItemModal(listing)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-lg border ${getBadgeStyle()}`}>
            {listing.transactionType === 'sell' ? `FOR SALE • ₹${listing.price}` : listing.transactionType.replace('_', ' ')}
          </span>
          <span className="px-2 py-0.5 text-[11px] font-semibold text-slate-500 bg-slate-100 rounded-md capitalize">
            {listing.category}
          </span>
        </div>

        {/* Title & Condition */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {listing.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
              {listing.condition}
            </span>
          </div>
        </div>

        {/* Pricing / Swap Details */}
        <div className="pt-1">
          {listing.transactionType === 'free' ? (
            <span className="text-xl font-black text-emerald-600">FREE</span>
          ) : listing.transactionType === 'sell' ? (
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">₹{listing.price}</span>
              <span className="text-[10px] text-slate-400 font-medium line-through">₹{Math.round((listing.price || 400) * 2.2)}</span>
            </div>
          ) : (
            <div className="p-2 bg-purple-50/70 border border-purple-100 rounded-xl text-[11px] text-purple-900 font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span className="truncate"><strong>Wants:</strong> {listing.swapWants || 'Open for exchange'}</span>
            </div>
          )}
        </div>

        {/* Location Tag */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
          <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
          <span className="truncate">{listing.locationTag || 'Campus Safe Zone'}</span>
        </div>
      </div>

      {/* Seller Credentials Card */}
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
              {sellerInitial}
            </div>
            <div className="text-[11px] font-bold text-slate-800 truncate max-w-[120px]">
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
          className="w-full py-2 px-3 text-xs font-bold text-indigo-600 bg-indigo-50/70 group-hover:bg-indigo-600 group-hover:text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
        >
          <span>View Details & Offer</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}   