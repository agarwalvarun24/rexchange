// frontend/src/components/ListingCard.tsx
'use client';

import React, { useState } from 'react';
import { MapPin, ShieldCheck, ArrowRight, Tag, Star, Building2, X, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Listing } from '../types';
import { useExchange } from '../context/ExchangeContext';

interface ListingCardProps {
  listing: Listing;
}

const transactionTypeStyles: Record<string, string> = {
  sell: 'bg-amber-50 text-amber-700 border-amber-200',
  swap: 'bg-blue-50 text-blue-700 border-blue-200',
  free: 'bg-green-50 text-green-700 border-green-200',
  skill_trade: 'bg-purple-50 text-purple-700 border-purple-200',
};

const categoryLabels: Record<string, string> = {
  textbooks: 'Textbook',
  electronics: 'Electronics',
  notes: 'Notes',
  skills: 'Skill',
  tickets: 'Ticket',
  giveaway: 'Giveaway',
};

const getMockRating = (id: number): { score: number; exchanges: number } => {
  const score = (3.5 + (id % 5) * 0.3).toFixed(1);
  const exchanges = 10 + (id * 7) % 40;
  return { score: parseFloat(score), exchanges };
};

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const { openItemModal } = useExchange();
  const { score, exchanges } = getMockRating(listing.id);
  const [showVerifiedTooltip, setShowVerifiedTooltip] = useState(false);

  const transactionLabel =
    listing.transactionType === 'sell' ? `FOR SALE · ₹${listing.price}` :
    listing.transactionType === 'swap' ? 'BARTER / SWAP' :
    listing.transactionType === 'free' ? 'FREE GIVEAWAY' :
    listing.transactionType === 'skill_trade' ? 'SKILL TRADE' : '';

  return (
    <div className="relative bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col border border-gray-100">
      {/* Top row: badges */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${transactionTypeStyles[listing.transactionType] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
          {transactionLabel}
        </span>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Tag size={12} />
          {categoryLabels[listing.category] || listing.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
        {listing.title}
      </h3>

      {/* Condition tag */}
      {listing.condition && listing.condition !== 'N/A' && (
        <div className="mb-2">
          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
            {listing.condition}
          </span>
        </div>
      )}

      {/* Price or swap wish */}
      <div className="flex-1">
        {listing.transactionType === 'sell' && listing.price > 0 ? (
          <p className="text-indigo-600 font-bold text-xl">₹{listing.price}</p>
        ) : listing.transactionType === 'swap' || listing.transactionType === 'skill_trade' ? (
          <p className="text-sm text-gray-600">
            <span className="font-medium">Wants:</span> {listing.swapWants || 'Open to offers'}
          </p>
        ) : listing.transactionType === 'free' ? (
          <p className="text-green-600 font-medium text-sm">Free</p>
        ) : null}
      </div>

      {/* Location */}
      <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-3 bg-gray-50 rounded-md px-2 py-1">
        <MapPin size={14} className="text-indigo-500" />
        <span className="truncate">{listing.locationTag}</span>
      </div>

      {/* Seller info + trust score + verified item badge */}
      <div className="flex items-center justify-between mt-3 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <span className="text-xs font-medium text-gray-700 truncate">{listing.sellerName}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500 truncate">{listing.sellerMajor}</span>
          {listing.isVerified && (
            <ShieldCheck size={16} className="text-green-500 shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 ml-2 shrink-0" title="Trust score">
          <Star size={12} className="text-amber-500 fill-amber-500" />
          <span>{score} · Verified</span>
        </div>
      </div>

      {/* Verified Item pill badge with tooltip */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowVerifiedTooltip(!showVerifiedTooltip);
        }}
        className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-full py-1.5 hover:bg-green-100 transition-colors"
      >
        <ShieldCheck size={14} className="text-green-600" />
        🛡️ Verified Item
      </button>

      {/* Campus tag */}
      {listing.campus && (
        <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
          <Building2 size={12} />
          <span>{listing.campus}</span>
        </div>
      )}

      {/* CTA button */}
      <button
        onClick={() => openItemModal(listing)}
        className="mt-4 w-full inline-flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium text-sm py-2 rounded-lg transition-colors"
      >
        Make Offer / Details
        <ArrowRight size={16} />
      </button>

      {/* Tooltip popover */}
      {showVerifiedTooltip && (
        <div className="absolute z-30 left-1/2 transform -translate-x-1/2 bottom-20 w-64 bg-white border border-gray-200 shadow-xl rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-800 flex items-center gap-1">
              <ShieldCheck size={16} className="text-green-600" /> Campus Verified Item
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowVerifiedTooltip(false);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>
          <ul className="space-y-1.5 text-xs text-gray-600">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
              Student ID & Hostel Block Confirmed
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
              Live Photo Possession Check Passed
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
              Protected by Safe Meetup Handover OTP
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ListingCard;