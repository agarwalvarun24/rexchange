// frontend/src/components/CreateRequestModal.tsx
'use client';

import React, { useState, FormEvent } from 'react';
import { X, IndianRupee } from 'lucide-react';
import { useExchange, CAMPUSES } from '../context/ExchangeContext';
import { Category, Urgency } from '../types';

const CreateRequestModal = () => {
  const { isCreateRequestModalOpen, closeCreateRequestModal, addNewRequest } = useExchange();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'textbooks' as Category,
    campus: CAMPUSES[1], // first specific campus
    requesterName: '',
    requesterMajor: '',
    reward: '',
    urgency: 'moderate' as Urgency,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCreateRequestModalOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.requesterName || !formData.requesterMajor) {
      alert('Please fill in all required fields');
      return;
    }

    await addNewRequest({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      campus: formData.campus,
      requesterName: formData.requesterName,
      requesterMajor: formData.requesterMajor,
      reward: formData.reward ? Number(formData.reward) : 0,
      urgency: formData.urgency,
    });

    // Reset form
    setFormData({
      title: '',
      description: '',
      category: 'textbooks',
      campus: CAMPUSES[1],
      requesterName: '',
      requesterMajor: '',
      reward: '',
      urgency: 'moderate',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-start justify-center p-4 pt-10">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Post a Request / Bounty</h2>
          <button onClick={closeCreateRequestModal} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Need Drafter for Engineering Drawing Exam"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe what you need and any deadlines"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgency *</label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="urgent">🔴 Urgent (Today)</option>
                <option value="moderate">🟡 Moderate</option>
                <option value="flexible">🟢 Flexible</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reward / Bounty (₹, optional)</label>
              <div className="relative">
                <IndianRupee size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="number"
                  name="reward"
                  value={formData.reward}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0 (trade)"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campus Zone *</label>
              <select
                name="campus"
                value={formData.campus}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CAMPUSES.filter(c => c !== 'All Campuses').map((campus) => (
                  <option key={campus} value={campus}>{campus}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
              <input
                type="text"
                name="requesterName"
                value={formData.requesterName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Ravi Kumar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Major *</label>
              <input
                type="text"
                name="requesterMajor"
                value={formData.requesterMajor}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Mechanical Engineering"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={closeCreateRequestModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50"
            >
              {isSubmitting ? 'Posting...' : 'Post Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestModal;