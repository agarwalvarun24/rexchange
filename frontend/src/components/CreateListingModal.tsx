// frontend/src/components/CreateListingModal.tsx
'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { X, MapPin, IndianRupee, Sparkles, Check } from 'lucide-react';
import { useExchange, CAMPUSES } from '../context/ExchangeContext';
import { CreateListingInput, Category, TransactionType, AIPricingSuggestion } from '../types';
import { fetchSafeLocations, getAISuggestion } from '../services/api';

const CreateListingModal = () => {
  const { isCreateModalOpen, closeCreateModal, addNewListing } = useExchange();
  const [safeLocations, setSafeLocations] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'textbooks' as Category,
    transactionType: 'sell' as TransactionType,
    price: '',
    swapWants: '',
    condition: 'Good',
    locationTag: '',
    campus: CAMPUSES[1],
    sellerName: '',
    sellerMajor: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // AI suggestion state
  const [aiSuggestion, setAiSuggestion] = useState<AIPricingSuggestion | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    if (isCreateModalOpen) {
      fetchSafeLocations()
        .then((locations) => {
          setSafeLocations(locations);
          if (locations.length > 0 && !formData.locationTag) {
            setFormData((prev) => ({ ...prev, locationTag: locations[0] }));
          }
        })
        .catch(() => {
          setSafeLocations([
            'Central Library Foyer',
            'Student Activity Center',
            'Main Canteen',
            'Engineering Block Entrance',
          ]);
        });
    }
  }, [isCreateModalOpen]);

  if (!isCreateModalOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAIClick = async () => {
    if (!formData.title || !formData.category || !formData.condition) {
      alert('Please fill in title, category, and condition first');
      return;
    }
    setIsLoadingAI(true);
    try {
      const suggestion = await getAISuggestion(formData.title, formData.category, formData.condition);
      setAiSuggestion(suggestion);
    } catch (err) {
      alert('Failed to get AI suggestion');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const applySuggestion = () => {
    if (aiSuggestion && formData.transactionType === 'sell') {
      setFormData((prev) => ({ ...prev, price: String(aiSuggestion.suggestedPrice) }));
    }
    // Could also prefill swapWants if swap/skill
    if (aiSuggestion && (formData.transactionType === 'swap' || formData.transactionType === 'skill_trade')) {
      setFormData((prev) => ({ ...prev, swapWants: aiSuggestion.swapRecommendations[0] || prev.swapWants }));
    }
    setAiSuggestion(null); // hide card after applying
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.locationTag || !formData.campus) {
      alert('Please fill in all required fields');
      return;
    }

    const listingData: CreateListingInput = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      transactionType: formData.transactionType,
      price: formData.transactionType === 'sell' ? Number(formData.price) || 0 : 0,
      swapWants: formData.transactionType === 'swap' || formData.transactionType === 'skill_trade'
        ? formData.swapWants
        : '',
      condition: formData.condition,
      locationTag: formData.locationTag,
      campus: formData.campus,
      sellerName: formData.sellerName,
      sellerMajor: formData.sellerMajor,
      isVerified: true,
    };

    setIsSubmitting(true);
    try {
      await addNewListing(listingData);
      setFormData({
        title: '',
        description: '',
        category: 'textbooks',
        transactionType: 'sell',
        price: '',
        swapWants: '',
        condition: 'Good',
        locationTag: safeLocations[0] || '',
        campus: CAMPUSES[1],
        sellerName: '',
        sellerMajor: '',
      });
      setAiSuggestion(null);
    } catch (error) {
      alert('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-start justify-center p-4 pt-10">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Post New Listing</h2>
          <button onClick={closeCreateModal} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title & AI helper */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Calculus Book 8th Edition"
              />
              <button
                type="button"
                onClick={handleAIClick}
                disabled={isLoadingAI}
                className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm px-3 py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors"
              >
                <Sparkles size={16} />
                AI Price & Barter
              </button>
            </div>
          </div>

          {/* AI Suggestion Card */}
          {aiSuggestion && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-indigo-900">⚡ AI Fair-Price & Barter Matcher</h3>
                <button
                  type="button"
                  onClick={applySuggestion}
                  className="text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-100 px-3 py-1 rounded-full transition-colors"
                >
                  Apply Suggestion
                </button>
              </div>
              <p className="text-sm text-indigo-800 mb-2">
                Suggested Price: <span className="font-bold">₹{aiSuggestion.suggestedPrice}</span> (₹{aiSuggestion.minPrice} - ₹{aiSuggestion.maxPrice}) · Save {aiSuggestion.savingsPercentage}% vs new
              </p>
              <p className="text-xs text-indigo-600 mb-2">{aiSuggestion.reason}</p>
              <div>
                <p className="text-sm font-medium text-indigo-800 mb-1">Smart Barter Ideas:</p>
                <ul className="list-disc list-inside text-xs text-indigo-700 space-y-1">
                  {aiSuggestion.swapRecommendations.slice(0, 2).map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe condition, details, etc."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="textbooks">Textbooks</option>
                <option value="electronics">Electronics</option>
                <option value="notes">Notes</option>
                <option value="skills">Skills</option>
                <option value="tickets">Tickets</option>
                <option value="giveaway">Giveaway</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type *</label>
              <select
                name="transactionType"
                value={formData.transactionType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="sell">For Sale</option>
                <option value="swap">Barter/Swap</option>
                <option value="free">Free</option>
                <option value="skill_trade">Skill Trade</option>
              </select>
            </div>
          </div>

          {formData.transactionType === 'sell' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <div className="relative">
                <IndianRupee size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="1"
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                />
              </div>
            </div>
          )}

          {(formData.transactionType === 'swap' || formData.transactionType === 'skill_trade') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What do you want in return? *
              </label>
              <input
                type="text"
                name="swapWants"
                value={formData.swapWants}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Python help, guitar lessons, coffee"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Digital PDF">Digital PDF</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campus Zone *</label>
              <select
                name="campus"
                value={formData.campus}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CAMPUSES.filter(c => c !== 'All Campuses').map((campus) => (
                  <option key={campus} value={campus}>{campus}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campus Meetup Location *</label>
            <select
              name="locationTag"
              value={formData.locationTag}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select location</option>
              {safeLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
              <input
                type="text"
                name="sellerName"
                value={formData.sellerName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Major *</label>
              <input
                type="text"
                name="sellerMajor"
                value={formData.sellerMajor}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Computer Science"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={closeCreateModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListingModal;