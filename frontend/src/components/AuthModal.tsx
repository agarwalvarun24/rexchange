'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Lock, ArrowRight, Key } from 'lucide-react';
import { useExchange, CAMPUSES } from '../context/ExchangeContext';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, loginWithCollegeEmail } = useExchange();
  const [step, setStep] = useState<'details' | 'otp' | 'success'>('details');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);

  const [form, setForm] = useState({
    name: 'Varun Agarwal',
    email: 'varun@campus.edu',
    major: 'Computer Science',
    campus: 'Main Campus - North Wing',
    dorm: 'Hostel Block A'
  });

  if (!isAuthModalOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    if (otp === '1234' || otp.length === 4) {
      loginWithCollegeEmail(form.email, form.name, form.major, form.campus, form.dorm);
      setStep('success');
      setTimeout(() => {
        closeAuthModal();
        setStep('details');
      }, 1400);
    } else {
      setOtpError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Student Verification</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Authenticate with institutional email</p>
            </div>
          </div>
          <button onClick={closeAuthModal} className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'details' && (
            <form onSubmit={handleSendOtp} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Full Student Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g., Varun Agarwal"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">College Email Address (.edu / .ac.in) *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@university.edu"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Major / Branch *</label>
                  <input
                    type="text"
                    name="major"
                    value={form.major}
                    onChange={handleChange}
                    placeholder="Computer Science"
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Hostel / Dorm Block *</label>
                  <input
                    type="text"
                    name="dorm"
                    value={form.dorm}
                    onChange={handleChange}
                    placeholder="Hostel Block A"
                    required
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Campus Zone *</label>
                <select
                  name="campus"
                  value={form.campus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {CAMPUSES.filter(c => c !== 'All Campuses').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Send Demo Verification Code →</span>
                </button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Enter Campus Passcode</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  We sent a 4-digit code to <strong>{form.email}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="1234"
                  className="w-36 mx-auto px-3 py-2 text-lg font-mono text-center tracking-widest bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400">Demo Code: Enter <strong>1234</strong></p>
                {otpError && <p className="text-xs text-red-500 font-bold">Invalid code. Enter 1234.</p>}
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all"
              >
                Verify & Unlock Student Badge
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-6 space-y-3 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Identity Verified!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Welcome to RExchange, <strong>{form.name}</strong></p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}