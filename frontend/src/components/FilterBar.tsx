// frontend/src/components/FilterBar.tsx
'use client';

import React from 'react';
import { useExchange } from '../context/ExchangeContext';

const categories = [
  { label: 'All', value: null, icon: '🏷️' },
  { label: 'Textbooks', value: 'textbooks', icon: '📚' },
  { label: 'Electronics', value: 'electronics', icon: '💻' },
  { label: 'Notes', value: 'notes', icon: '📝' },
  { label: 'Skills', value: 'skills', icon: '💡' },
  { label: 'Tickets', value: 'tickets', icon: '🎟️' },
  { label: 'Free Giveaways', value: 'giveaway', icon: '🎁' },
];

const transactionTypes = [
  { label: 'All Types', value: null },
  { label: 'For Sale', value: 'sell' },
  { label: 'Barter/Swap', value: 'swap' },
  { label: 'Free', value: 'free' },
  { label: 'Skill Trade', value: 'skill_trade' },
];

const FilterBar = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    transactionFilter,
    setTransactionFilter,
    verifiedOnly,
    setVerifiedOnly,
  } = useExchange();

  return (
    <div className="bg-white border-b border-gray-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat.value ?? 'all'}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Transaction type dropdown + Verified Only toggle in same row */}
        <div className="flex items-center gap-4">
          <select
            value={transactionFilter ?? ''}
            onChange={(e) => setTransactionFilter(e.target.value || null)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {transactionTypes.map((type) => (
              <option key={type.value ?? 'all'} value={type.value ?? ''}>
                {type.label}
              </option>
            ))}
          </select>

          {/* Verified Only toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                verifiedOnly ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  verifiedOnly ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className="text-sm text-gray-700">Verified Only</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;