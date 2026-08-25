// frontend/src/components/RequestBoard.tsx
'use client';

import React, { useState } from 'react';
import { MapPin, ShieldCheck, Clock, IndianRupee, AlertCircle, HandHeart, MessageCircle } from 'lucide-react';
import { useExchange } from '../context/ExchangeContext';
import { StudentRequest } from '../types';

const urgencyStyles = {
  urgent: 'bg-red-100 text-red-700 border-red-200',
  moderate: 'bg-amber-100 text-amber-700 border-amber-200',
  flexible: 'bg-blue-100 text-blue-700 border-blue-200',
};

const urgencyLabels = {
  urgent: '🔴 URGENT',
  moderate: '🟡 Moderate',
  flexible: '🟢 Flexible',
};

const RequestBoard = () => {
  const { requests, isLoading, error, sendRequestResponse } = useExchange();
  const [respondToRequest, setRespondToRequest] = useState<StudentRequest | null>(null);
  const [responseForm, setResponseForm] = useState({ fromName: '', contact: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRespond = (request: StudentRequest) => {
    setRespondToRequest(request);
    setSuccessMessage('');
    setResponseForm({ fromName: '', contact: '', message: '' });
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondToRequest) return;
    if (!responseForm.fromName || !responseForm.contact) {
      alert('Please fill in your name and contact');
      return;
    }
    setIsSubmitting(true);
    try {
      await sendRequestResponse(respondToRequest.id, {
        fromName: responseForm.fromName,
        contact: responseForm.contact,
        message: responseForm.message,
      });
      setSuccessMessage('Response sent! The requester will contact you.');
      setTimeout(() => {
        setRespondToRequest(null);
        setSuccessMessage('');
      }, 2000);
    } catch (err) {
      alert('Failed to send response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading requests...</div>;
  }
  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div>
      {requests.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No active requests. Be the first to post one!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-5 flex flex-col border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${urgencyStyles[request.urgency]}`}>
                  {urgencyLabels[request.urgency]}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(request.timePosted).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{request.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">{request.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <MapPin size={14} className="text-indigo-500" />
                <span>{request.campus}</span>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">{request.requesterName}</span>
                  <span className="text-xs text-gray-500">• {request.requesterMajor}</span>
                </div>
                {request.reward > 0 ? (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    <IndianRupee size={12} />
                    {request.reward} Bounty
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    <HandHeart size={12} />
                    Trade
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400 mb-3">
                {request.responsesCount} {request.responsesCount === 1 ? 'person' : 'people'} responded
              </div>
              <button
                onClick={() => handleRespond(request)}
                className="mt-auto w-full inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm py-2 rounded-lg transition-colors"
              >
                <MessageCircle size={16} />
                I Have This! / Help Out
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Response Modal */}
      {respondToRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Respond to Request</h3>
            {successMessage ? (
              <div className="text-green-600 font-medium">{successMessage}</div>
            ) : (
              <form onSubmit={handleSubmitResponse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    value={responseForm.fromName}
                    onChange={(e) => setResponseForm({ ...responseForm, fromName: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Alex Chen"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info *</label>
                  <input
                    type="text"
                    value={responseForm.contact}
                    onChange={(e) => setResponseForm({ ...responseForm, contact: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Email or Hostel Room"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message (optional)</label>
                  <textarea
                    value={responseForm.message}
                    onChange={(e) => setResponseForm({ ...responseForm, message: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Say what you have or how you can help"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRespondToRequest(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Response'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestBoard;