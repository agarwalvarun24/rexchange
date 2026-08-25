// frontend/src/components/AuthModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle, Mail, GraduationCap, Home } from 'lucide-react';
import { useExchange, CAMPUSES } from '../context/ExchangeContext';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithCollegeEmail } = useExchange();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    major: '',
    campus: CAMPUSES[0],
    dorm: '',
  });
  const [otp, setOtp] = useState('');
  const [verificationError, setVerificationError] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep(1);
      setFormData({
        name: '',
        email: '',
        major: '',
        campus: CAMPUSES[0],
        dorm: '',
      });
      setOtp('');
      setVerificationError('');
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.major || !formData.dorm) {
      alert('Please fill in all required fields');
      return;
    }
    // Basic email domain check (simulate)
    if (!formData.email.includes('.edu') && !formData.email.includes('.ac.')) {
      setVerificationError('Please use your college email (e.g., .edu or .ac.in)');
      return;
    }
    setVerificationError('');
    setStep(2);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value.replace(/\D/g, '').slice(0, 4));
  };

  const handleVerify = () => {
    if (otp.length === 4) {
      // Simulate success
      loginWithCollegeEmail(
        formData.email,
        formData.name,
        formData.major,
        formData.campus,
        formData.dorm
      );
      setStep(3);
    } else {
      setVerificationError('Please enter the 4‑digit code');
    }
  };

  const fillDemoCode = () => {
    setOtp('1234');
    setVerificationError('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeAuthModal} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Student Verification</h2>
            <p className="text-sm text-gray-500 mt-1">Get your campus trading badge</p>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= i ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {i}
              </div>
              {i < 3 && (
                <div className={`flex-1 h-1 mx-2 ${step > i ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Personal details */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Alex Chen"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">College Email *</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="you@university.edu"
                />
              </div>
              {verificationError && (
                <p className="text-xs text-red-600 mt-1">{verificationError}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Major *</label>
                <input
                  type="text"
                  name="major"
                  value={formData.major}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dorm / Block *</label>
                <input
                  type="text"
                  name="dorm"
                  value={formData.dorm}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Hostel A"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campus</label>
              <select
                name="campus"
                value={formData.campus}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CAMPUSES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Continue
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-2">
              <p className="text-sm text-gray-600">
                We sent a 4‑digit code to <span className="font-medium">{formData.email}</span>
              </p>
              <button
                onClick={fillDemoCode}
                className="text-indigo-600 hover:text-indigo-800 text-xs underline mt-1"
              >
                Use Demo Code
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter Code *</label>
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                maxLength={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••"
              />
              {verificationError && (
                <p className="text-xs text-red-600 mt-1">{verificationError}</p>
              )}
            </div>
            <button
              onClick={handleVerify}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Verify & Activate Badge
            </button>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">You're Verified!</h3>
            <p className="text-gray-600 text-sm">
              You now have the <span className="font-medium text-green-700">Verified Campus Trader</span> badge with 100% Trust Score.
            </p>
            <button
              onClick={closeAuthModal}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Start Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;