'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, CheckCircle2, Key, Sparkles, Send, ArrowRight, Lock, Check } from 'lucide-react';
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
  const { selectedListingForModal, closeItemModal, sendOffer, currentUser } = useExchange();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerSubmitted, setOfferSubmitted] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('7421');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isTradeCompleted, setIsTradeCompleted] = useState(false);
  const [otpError, setOtpError] = useState(false);

  const [offerForm, setOfferForm] = useState({
    fromName: currentUser?.name || '',
    contact: currentUser?.email || '',
    offerDetails: '',
    meetupLocation: 'Central Library Foyer'
  });

  if (!selectedListingForModal) return null;

  const listing = selectedListingForModal;

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
      // Generate a random 4-digit handshake OTP
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-indigo-100 text-indigo-700">
              {listing.category}
            </span>
            <span className="text-xs text-slate-500">• {listing.condition}</span>
          </div>
          <button 
            onClick={closeItemModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Main Info */}
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-900">{listing.title}</h2>
              <div className="text-2xl font-extrabold text-indigo-600 whitespace-nowrap">
                {listing.transactionType === 'free' ? (
                  <span className="text-emerald-600">FREE</span>
                ) : listing.transactionType === 'sell' ? (
                  `₹${listing.price}`
                ) : (
                  <span className="text-purple-600 text-lg uppercase font-bold">{listing.transactionType.replace('_', ' ')}</span>
                )}
              </div>
            </div>

            {listing.swapWants && (
              <div className="mt-2 p-3 bg-purple-50 border border-purple-100 rounded-xl text-xs text-purple-900 font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span><strong>Swap Wanted:</strong> {listing.swapWants}</span>
              </div>
            )}

            <p className="mt-3 text-slate-600 text-sm leading-relaxed">{listing.description}</p>
          </div>

          {/* 3-Tier Product Verification Audit */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Campus Product Verification Audit</span>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-600 text-white rounded-full">
                100% VERIFIED
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-emerald-900">
              <div className="flex items-center gap-1.5 bg-white/80 p-2 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Student ID Verified</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 p-2 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Live Photo Check</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 p-2 rounded-lg border border-emerald-100">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Handshake OTP Protected</span>
              </div>
            </div>
          </div>

          {/* Seller & Meetup Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-800">Seller:</span>
              <span>{listing.sellerName} ({listing.sellerMajor})</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{listing.locationTag || 'Campus Main Library'}</span>
            </div>
          </div>

          {/* 2-Way Buyer-Seller Handshake Authentication Section */}
          <div className="border-t border-slate-100 pt-5">
            {!offerSubmitted ? (
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Send className="w-4 h-4 text-indigo-600" />
                  Step 1: Make an Exchange Offer (Buyer Side)
                </h3>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        name="fromName"
                        value={offerForm.fromName}
                        onChange={handleChange}
                        placeholder="e.g., Varun Agarwal"
                        required
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Contact (Email / Room No.) *</label>
                      <input
                        type="text"
                        name="contact"
                        value={offerForm.contact}
                        onChange={handleChange}
                        placeholder="e.g., varun@campus.edu or Room 302"
                        required
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Offer / Trade Proposal *</label>
                    <textarea
                      name="offerDetails"
                      rows={2}
                      value={offerForm.offerDetails}
                      onChange={handleChange}
                      placeholder="e.g., Offering ₹450 in cash or can swap for my DBMS notes."
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Safe Meetup Zone *</label>
                    <select
                      name="meetupLocation"
                      value={offerForm.meetupLocation}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium"
                    >
                      {safeLocations.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={closeItemModal}
                      className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <span>{isSubmitting ? 'Generating Pass...' : 'Submit Offer & Generate Handshake Pass →'}</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Step 2: Active Handshake Pass & Seller Verification */
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Buyer Handover Pass */}
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wide">Digital Safe Handover Pass</h4>
                        <p className="text-[11px] text-indigo-700">Meetup Scheduled at: <strong>{offerForm.meetupLocation}</strong></p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-200 text-indigo-800 rounded-full">
                      ACTIVE PASS
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-indigo-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-500 font-medium">Buyer's Secret Handshake OTP:</p>
                      <p className="text-[10px] text-slate-400">Share this code ONLY after inspecting the item in person.</p>
                    </div>
                    <div className="px-4 py-1.5 bg-indigo-600 text-white font-mono text-lg font-black tracking-widest rounded-lg shadow-sm">
                      {generatedOtp}
                    </div>
                  </div>
                </div>

                {/* In-Person Handshake Verification Simulator */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-emerald-600" />
                      Step 2: In-Person Meetup Verification (Seller Side)
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">Live Simulator</span>
                  </div>

                  {isTradeCompleted ? (
                    <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2 animate-in zoom-in-95">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      <div>
                        <strong>🎉 Handshake Verified & Trade Completed!</strong>
                        <p className="text-[11px] text-emerald-800 mt-0.5">Item marked as Exchanged. Seller reputation increased by +10 trust points.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-600">
                        At the meetup, the seller enters the buyer's 4-digit OTP to authenticate handover and close the listing:
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={enteredOtp}
                          onChange={(e) => setEnteredOtp(e.target.value)}
                          placeholder={`Enter OTP (${generatedOtp})`}
                          className={`w-40 px-3 py-1.5 text-sm font-mono text-center border rounded-lg focus:outline-none ${
                            otpError ? 'border-red-400 bg-red-50 text-red-700' : 'border-slate-300 focus:ring-2 focus:ring-emerald-500'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={handleVerifyHandshake}
                          className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          <span>Verify & Close Trade</span>
                        </button>
                      </div>
                      {otpError && <p className="text-[11px] text-red-600 font-medium">Incorrect OTP. Enter the 4-digit code shown above.</p>}
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOfferSubmitted(false);
                      setIsTradeCompleted(false);
                      setEnteredOtp('');
                      closeItemModal();
                    }}
                    className="px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Done / Close
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