'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, CheckCircle2, Clock, Key, Sparkles, Send } from 'lucide-react';
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
  const { selectedListingForModal, closeItemModal, sendOffer } = useExchange();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [offerForm, setOfferForm] = useState({
    fromName: '',
    contact: '',
    offerDetails: '',
    meetupLocation: ''
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
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
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

          {/* 3-Tier Product Verification Card */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Campus Product Verification Audit</span>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold bg-emerald-600 text-white rounded-full">
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
                <span>Safe OTP Handover</span>
              </div>
            </div>

            {/* Handover OTP Simulator */}
            <div className="pt-2 border-t border-emerald-200/50 flex items-center justify-between">
              <span className="text-xs text-emerald-800">Meetup Safety Handshake Passcode:</span>
              <button
                type="button"
                onClick={() => setShowOtp(!showOtp)}
                className="px-2.5 py-1 text-xs font-medium bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors flex items-center gap-1"
              >
                <Key className="w-3 h-3" />
                {showOtp ? 'Code: 7392' : 'Reveal Handshake OTP'}
              </button>
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

          {/* Offer & Negotiation Form */}
          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Send className="w-4 h-4 text-indigo-600" />
              Make an Exchange Offer / Barter Request
            </h3>

            {isSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <strong>Offer Sent Successfully!</strong>
                  <p className="text-xs text-emerald-700 mt-0.5">The seller will contact you to confirm the safe meetup zone.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      name="fromName"
                      value={offerForm.fromName}
                      onChange={handleChange}
                      placeholder="e.g., Varun Sharma"
                      required
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Contact (Email / Room No.)</label>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Offer / Trade Proposal</label>
                  <textarea
                    name="offerDetails"
                    rows={2}
                    value={offerForm.offerDetails}
                    onChange={handleChange}
                    placeholder="e.g., Offering ₹400 in cash or can swap for my DBMS notes."
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Safe Campus Meetup Spot</label>
                  <select
                    name="meetupLocation"
                    value={offerForm.meetupLocation}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                  >
                    <option value="">Select Safe Meetup Zone</option>
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
                    className="px-6 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending Offer...' : 'Send Offer →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}