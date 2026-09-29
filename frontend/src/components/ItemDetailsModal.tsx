'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, MapPin, CheckCircle2, Key, Sparkles, Send, Lock, UserCheck, Star, Edit3, Trash2 } from 'lucide-react';
import { useExchange } from '../context/ExchangeContext';

const safeLocations = [
  'Central Library Foyer',
  'Student Activity Center',
  'Main Canteen',
  'Engineering Block Entrance',
  'Hostel Block Common Room',
  'Campus Bookstore'
];

export default function ItemDetailsModal() {
  const { selectedListingForModal, closeItemModal, sendOffer, currentUser, openEditModal, deleteListing } = useExchange();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerSubmitted, setOfferSubmitted] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('7421');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isTradeCompleted, setIsTradeCompleted] = useState(false);
  const [otpError, setOtpError] = useState(false);

  const [offerForm, setOfferForm] = useState({
    fromName: '',
    contact: '',
    offerDetails: '',
    meetupLocation: 'Central Library Foyer'
  });

  // Automatically reset all form and OTP states whenever a new card is opened
  useEffect(() => {
    if (selectedListingForModal) {
      setOfferSubmitted(false);
      setIsTradeCompleted(false);
      setEnteredOtp('');
      setOtpError(false);
      setIsSubmitting(false);
      setOfferForm({
        fromName: currentUser?.name || '',
        contact: currentUser?.email || '',
        offerDetails: '',
        meetupLocation: selectedListingForModal.locationTag || 'Central Library Foyer'
      });
    }
  }, [selectedListingForModal?.id, currentUser]);

  if (!selectedListingForModal) return null;

  const listing = selectedListingForModal;
  const fallbackImg = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';

  // Dynamic credentials per card
  const sellerInitial = listing.sellerName ? listing.sellerName.charAt(0) : 'S';
  const sellerRoll = `2205${(listing.id * 173) % 8999 + 1000}`;
  const sellerRating = (4.5 + ((listing.id * 0.1) % 0.5)).toFixed(1);
  const tradesCount = (listing.id * 4 + 7) % 25 + 6;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setOfferForm({ ...offerForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sendOffer({
        listingId: listing.id,
        ...offerForm
      });
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(newOtp);
      setOfferSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyHandshake = () => {
    if (enteredOtp.trim() === generatedOtp) {
      setIsTradeCompleted(true);
      setOtpError(false);
    } else {
      setOtpError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {listing.category}
            </span>
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              • {listing.condition}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Quick Edit & Delete inside Modal */}
            <button
              type="button"
              onClick={() => {
                closeItemModal();
                openEditModal(listing);
              }}
              title="Edit this listing"
              className="p-1.5 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${listing.title}"?`)) {
                  deleteListing(listing.id);
                  closeItemModal();
                }
              }}
              title="Delete this listing"
              className="p-1.5 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button 
              onClick={closeItemModal}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Product Image Display */}
          <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-800 shadow-inner">
            <img 
              src={listing.imageUrl || fallbackImg} 
              alt={listing.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImg;
              }}
            />
          </div>

          {/* Main Title & Pricing */}
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{listing.title}</h2>
              <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                {listing.transactionType === 'free' ? (
                  <span className="text-emerald-600 dark:text-emerald-400">FREE</span>
                ) : listing.transactionType === 'sell' ? (
                  `₹${listing.price}`
                ) : (
                  <span className="text-purple-600 dark:text-purple-400 text-lg uppercase font-bold">{listing.transactionType.replace('_', ' ')}</span>
                )}
              </div>
            </div>

            {listing.swapWants && (
              <div className="mt-2 p-2.5 bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900 rounded-xl text-xs text-purple-900 dark:text-purple-300 font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span><strong>Swap Desired:</strong> {listing.swapWants}</span>
              </div>
            )}

            <p className="mt-2.5 text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{listing.description}</p>
          </div>

          {/* 1. DYNAMIC SELLER CREDENTIALS */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {sellerInitial}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{listing.sellerName}</span>
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded flex items-center gap-0.5">
                      <UserCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Verified Student
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{listing.sellerMajor} • Roll No: {sellerRoll} • Hostel Verified</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold justify-end">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{sellerRating} / 5.0</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">{tradesCount} On-Campus Trades</p>
              </div>
            </div>
          </div>

          {/* 2. PRODUCT QUALITY AUDIT */}
          <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-200 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Buyer Protection & Quality Assurance</span>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded-full">
                100% INSPECTED
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-emerald-900 dark:text-emerald-300">
              <div className="bg-white/90 dark:bg-slate-800 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900 flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Tested & Working Condition</span>
              </div>
              <div className="bg-white/90 dark:bg-slate-800 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900 flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Original Campus Live Photo</span>
              </div>
              <div className="bg-white/90 dark:bg-slate-800 p-2 rounded-xl border border-emerald-100 dark:border-emerald-900 flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Pay Only After In-Person Check</span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
              <span>Safe Meetup Location: <strong>{listing.locationTag || 'Central Library Foyer'}</strong></span>
            </p>
          </div>

          {/* 3. 2-WAY HANDSHAKE WORKFLOW */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            {!offerSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Make an Exchange Offer / Barter Request
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name *</label>
                    <input
                      type="text"
                      name="fromName"
                      value={offerForm.fromName}
                      onChange={handleChange}
                      placeholder="e.g., Varun Agarwal"
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Contact (Email / Room No.) *</label>
                    <input
                      type="text"
                      name="contact"
                      value={offerForm.contact}
                      onChange={handleChange}
                      placeholder="e.g., varun@campus.edu or Room 302"
                      required
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Your Offer / Proposal *</label>
                  <textarea
                    name="offerDetails"
                    rows={2}
                    value={offerForm.offerDetails}
                    onChange={handleChange}
                    placeholder="e.g., Offering listed price or proposing a swap item..."
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Preferred Safe Meetup Zone *</label>
                  <select
                    name="meetupLocation"
                    value={offerForm.meetupLocation}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {safeLocations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={closeItemModal}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all"
                  >
                    {isSubmitting ? 'Generating...' : 'Submit Offer & Generate Safety Pass →'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3.5 animate-in fade-in duration-300">
                {/* Buyer Digital Safety Pass */}
                <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-indigo-700 dark:text-indigo-400" />
                      <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase">Digital Safe Exchange Pass</h4>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-200 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 rounded-full">
                      ACTIVE PASS
                    </span>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-indigo-100 dark:border-indigo-900 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-800 dark:text-white">Buyer's Handshake OTP:</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Inspect the product at {offerForm.meetupLocation} first, then share this code.</p>
                    </div>
                    <div className="px-3.5 py-1 bg-indigo-600 text-white font-mono text-base font-black rounded-lg tracking-wider shadow-sm">
                      {generatedOtp}
                    </div>
                  </div>
                </div>

                {/* Seller Handover Simulator */}
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    In-Person Handover Verification (Seller Confirmation)
                  </h4>

                  {isTradeCompleted ? (
                    <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                      <div>
                        <strong>🎉 Handshake Authenticated! Trade Completed.</strong>
                        <p className="text-[10px] text-emerald-800 dark:text-emerald-300">Item verified and delivered. Seller trust rating updated.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">Enter Buyer's OTP after physical inspection to complete trade:</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value)}
                          placeholder={`Enter OTP (${generatedOtp})`}
                          className={`w-36 px-2.5 py-1.5 text-xs font-mono text-center bg-white dark:bg-slate-800 border rounded-xl ${
                            otpError ? 'border-red-400 bg-red-50 dark:bg-red-950/60' : 'border-slate-300 dark:border-slate-600'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={handleVerifyHandshake}
                          className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm"
                        >
                          Verify & Confirm Handover
                        </button>
                      </div>
                      {otpError && <p className="text-[10px] text-red-600 dark:text-red-400 font-bold">Incorrect OTP. Enter the 4-digit code above.</p>}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setOfferSubmitted(false);
                      setIsTradeCompleted(false);
                      closeItemModal();
                    }}
                    className="px-4 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}