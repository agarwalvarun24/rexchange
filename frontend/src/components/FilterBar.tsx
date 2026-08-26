'use client';

import React from 'react';
import { useExchange, CATEGORIES } from '../context/ExchangeContext';

const categoryIcons: Record<string, string> = {
  All: '🏷️',
  Textbooks: '📚',
  Electronics: '💻',
  Notes: '📝',
  Skills: '💡',
  Tickets: '🎟️',
  'Free Giveaways': '🎁'
};

export default function FilterBar() {
  const {
    selectedCategory,
    setSelectedCategory,
    transactionFilter,
    setTransactionFilter,
    verifiedOnly,
    setVerifiedOnly
  } = useExchange();

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 shadow-sm space-y-3 transition-colors">
      
      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-102'
                  : 'bg-slate-100/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700'
              }`}
            >
              <span>{categoryIcons[cat] || '🏷️'}</span>
              <span>{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary Controls (Transaction Type & Verified Switch) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Type:
          </label>
          <select
            value={transactionFilter}
            onChange={(e) => setTransactionFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-100/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Types</option>
            <option value="sell">For Sale (Cash ₹)</option>
            <option value="swap">Barter / Swap</option>
            <option value="skill_trade">Skill Trade</option>
            <option value="free">Free Giveaway</option>
          </select>
        </div>

        {/* Verified Toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-8 h-4.5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-500 relative" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Verified Students Only
          </span>
        </label>
      </div>

    </div>
  );
}