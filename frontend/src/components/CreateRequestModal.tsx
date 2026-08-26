'use client';

import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useExchange, CAMPUSES } from '../context/ExchangeContext';

export default function CreateRequestModal() {
  const { isCreateRequestModalOpen, closeCreateRequestModal, addNewRequest, currentUser } = useExchange();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'textbooks',
    campus: 'Main Campus - North Wing',
    urgency: 'urgent' as 'urgent' | 'moderate' | 'flexible',
    reward: '₹100 Bounty',
    requesterName: currentUser?.name || 'Student Member',
    requesterMajor: currentUser?.major || 'Computer Science'
  });

  if (!isCreateRequestModalOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addNewRequest({
        title: form.title,
        description: form.description,
        category: form.category,
        campus: form.campus,
        urgency: form.urgency,
        reward: form.reward,
        requesterName: form.requesterName || 'Student Member',
        requesterMajor: form.requesterMajor || 'Engineering'
      });
      closeCreateRequestModal();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Post a Student Request (Wanted)</h2>
              <p className="text-xs text-slate-500">Ask peers for urgent exam gear, books, or notes</p>
            </div>
          </div>
          <button onClick={closeCreateRequestModal} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">What do you need? *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Need Drafter for Engineering Drawing Exam tomorrow"
              required
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Urgency Level *</label>
              <select
                name="urgency"
                value={form.urgency}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium"
              >
                <option value="urgent">🔴 URGENT (Needed Today / Exam)</option>
                <option value="moderate">🟡 Moderate (Needed this week)</option>
                <option value="flexible">🟢 Flexible</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Optional Reward / Bounty</label>
              <input
                type="text"
                name="reward"
                value={form.reward}
                onChange={handleChange}
                placeholder="e.g. ₹150 Bounty or Free Coffee"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
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
                <option value="electronics">Electronics & Tools</option>
                <option value="notes">Notes & Study Guides</option>
                <option value="skills">Skill / Tutoring Help</option>
                <option value="tickets">Campus Tickets</option>
                <option value="giveaway">Borrow / Giveaway</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Location *</label>
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
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Details & Urgency Reason *</label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder="Explain when and where you need this on campus..."
              required
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={closeCreateRequestModal}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post Request →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}