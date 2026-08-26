'use client';

import React, { useState } from 'react';
import { useExchange } from '../context/ExchangeContext';
import { AlertCircle, Clock, MapPin, Sparkles, MessageSquare, CheckCircle2, Plus } from 'lucide-react';

export default function RequestBoard() {
  const { requests, openCreateRequestModal } = useExchange();
  const [respondedIds, setRespondedIds] = useState<number[]>([]);

  const handleRespond = (id: number) => {
    setRespondedIds((prev) => [...prev, id]);
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/80';
      case 'moderate':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/80';
      default:
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/80';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Post Request CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 rounded-xl shadow-inner">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Student Urgent Wanted Board</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Post urgent needs for tomorrow's exam, lab tools, or dorm essentials</p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateRequestModal}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-full shadow-md shadow-amber-600/20 hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Post a Request (Wanted)</span>
        </button>
      </div>

      {/* Requests Grid */}
      {requests.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No active student requests right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {requests.map((req) => {
            const hasResponded = respondedIds.includes(req.id);
            const requesterInitial = req.requesterName ? req.requesterName.charAt(0) : 'S';

            return (
              <div
                key={req.id}
                className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-sm hover:shadow-xl hover:border-amber-400/60 dark:hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-lg border ${getUrgencyBadge(req.urgency)}`}>
                      {req.urgency === 'urgent' ? '🔴 URGENT NEED' : req.urgency.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Today</span>
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                      {req.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {req.description}
                    </p>
                  </div>

                  {/* Campus Tag */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{req.campus}</span>
                  </div>
                </div>

                {/* Requester & Bounty Details */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                        {requesterInitial}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{req.requesterName}</p>
                        <p className="text-[10px] text-slate-400">{req.requesterMajor}</p>
                      </div>
                    </div>

                    {req.reward && (
                      <span className="px-2.5 py-1 text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>{req.reward}</span>
                      </span>
                    )}
                  </div>

                  {/* Respond Action */}
                  {hasResponded ? (
                    <div className="w-full py-2 px-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 animate-in zoom-in-95">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Response Sent to {req.requesterName}!</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRespond(req.id)}
                      className="w-full py-2 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>I Have This! / Help Out</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}