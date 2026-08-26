'use client';

import React, { useState } from 'react';
import { X, Sparkles, Plus, ShieldCheck } from 'lucide-react';
import { useExchange, CAMPUSES } from '../context/ExchangeContext';

export default function CreateListingModal() {
  const { isCreateModalOpen, closeCreateModal, addNewListing, currentUser } = useExchange();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'textbooks',
    transactionType: 'sell',
    price: '',
    swapWants: '',
    condition: 'Good',
    campus: 'Main Campus - North Wing',
    locationTag: 'Central Library Foyer',
    sellerName: currentUser?.name || 'Student Member',
    sellerMajor: currentUser?.major || 'Computer Science'
  });

  if (!isCreateModalOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAiEstimate = () => {
    setAiLoading(true);
    setTimeout(() => {
      let suggested = 400;
      if (form.category === 'electronics') suggested = 1200;
      if (form.category === 'notes') suggested = 150;
      if (form.category === 'tickets') suggested = 450;
      
      setForm((prev) => ({ ...prev, price: String(suggested) }));
      setAiSuggestion(`Suggested: ₹${suggested} (60% student discount) + Recommended Swaps: Semester notes or Drafter.`);
      setAiLoading(false);
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addNewListing({
        title: form.title,
        description: form.description,
        category: form.category,
        transactionType: form.transactionType as any,
        price: form.price ? Number(form.price) : 0,
        swapWants: form.swapWants,
        condition: form.condition,
        campus: form.campus,
        locationTag: form.locationTag,
        sellerName: form.sellerName || 'Student Member',
        sellerMajor: form.sellerMajor || 'Engineering'
      });
      closeCreateModal();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Post a Campus Listing</h2>
              <p className="text-xs text-slate-500">Sell, swap, trade skills, or giveaway to verified peers</p>
            </div>
          </div>
          <button onClick={closeCreateModal} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Item Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Calculus Early Transcendentals 8th Ed"
              required
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="textbooks">Textbooks</option>
                <option value="electronics">Electronics & Accessories</option>
                <option value="notes">Study Notes & PDFs</option>
                <option value="skills">Peer Skill Trade</option>
                <option value="tickets">Campus Event Tickets</option>
                <option value="giveaway">Free Giveaways</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Transaction Type *</label>
              <select
                name="transactionType"
                value={form.transactionType}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="sell">For Sale (Cash ₹)</option>
                <option value="swap">Barter / Item Swap</option>
                <option value="skill_trade">Skill Exchange</option>
                <option value="free">100% Free Giveaway</option>
              </select>
            </div>
          </div>

          {/* Pricing / Swap Details */}
          {form.transactionType === 'sell' ? (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Price in Rupees (₹) *</label>
                <button
                  type="button"
                  onClick={handleAiEstimate}
                  disabled={aiLoading}
                  className="text-xs font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {aiLoading ? 'Estimating...' : '⚡ AI Fair Price Suggest'}
                </button>
              </div>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="₹ e.g. 450"
                required
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              {aiSuggestion && (
                <p className="mt-1.5 text-xs text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-100">
                  {aiSuggestion}
                </p>
              )}
            </div>
          ) : form.transactionType !== 'free' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">What would you like in return? *</label>
              <input
                type="text"
                name="swapWants"
                value={form.swapWants}
                onChange={handleChange}
                placeholder="e.g., Need DBMS notes, coffee, or Python tutoring"
                required
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Zone *</label>
              <select
                name="campus"
                value={form.campus}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                {CAMPUSES.filter(c => c !== 'All Campuses').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Condition</label>
              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="New">Brand New / Sealed</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good Condition</option>
                <option value="Fair">Fair / Usable</option>
                <option value="Digital PDF">Digital PDF</option>
              </select>
            </div>
          </div>

          {/* Seller Authenticity Guarantee */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Campus Trust Verification Guarantee:</strong>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                This item will be listed with your verified Student ID. You agree to safe meetup handover at designated campus zones.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
            <textarea
              name="description"
              rows={2}
              value={form.description}
              onChange={handleChange}
              placeholder="Provide details on item condition, edition, or exchange terms..."
              required
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={closeCreateModal}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Publish Verified Listing →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}