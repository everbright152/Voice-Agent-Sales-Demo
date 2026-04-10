'use client';

import { useState } from 'react';
import { BusinessData, NicheType, FAQ } from '@/lib/types';
import { getNicheConfig } from '@/lib/niches';

interface BusinessDataEditorProps {
  data: BusinessData;
  niche: NicheType;
  onConfirm: (data: BusinessData) => void;
  onBack: () => void;
}

export default function BusinessDataEditor({ data, niche, onConfirm, onBack }: BusinessDataEditorProps) {
  const [editedData, setEditedData] = useState<BusinessData>(data);
  const [newService, setNewService] = useState('');
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const nicheConfig = getNicheConfig(niche);

  const update = (field: keyof BusinessData, value: unknown) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const addService = () => {
    if (newService.trim()) {
      update('services', [...editedData.services, newService.trim()]);
      setNewService('');
    }
  };

  const removeService = (i: number) => {
    update('services', editedData.services.filter((_, idx) => idx !== i));
  };

  const addFaq = () => {
    if (newFaqQ.trim() && newFaqA.trim()) {
      update('faq', [...editedData.faq, { question: newFaqQ.trim(), answer: newFaqA.trim() }]);
      setNewFaqQ('');
      setNewFaqA('');
    }
  };

  const removeFaq = (i: number) => {
    update('faq', editedData.faq.filter((_, idx) => idx !== i));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={`inline-flex items-center gap-2 ${nicheConfig.bgColor} ${nicheConfig.color} border ${nicheConfig.borderColor} rounded-full px-3 py-1 text-xs font-medium mb-2`}>
              {nicheConfig.icon} {nicheConfig.label}
            </div>
            <h2 className="text-2xl font-bold text-white">Review & Edit Business Info</h2>
            <p className="text-slate-400 mt-1 text-sm">
              This data will be injected into the AI agent. Edit anything that's wrong — the agent will use exactly this information.
            </p>
          </div>
          <div className="text-3xl">{nicheConfig.icon}</div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-white text-lg border-b border-white/10 pb-3">Basic Information</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Business Name *</label>
            <input
              value={editedData.business_name}
              onChange={e => update('business_name', e.target.value)}
              className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 text-sm"
              placeholder="Your Business Name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Phone Number</label>
            <input
              value={editedData.phone}
              onChange={e => update('phone', e.target.value)}
              className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 text-sm"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
            <input
              value={editedData.email}
              onChange={e => update('email', e.target.value)}
              className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 text-sm"
              placeholder="info@yourbusiness.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Booking/Appointment Link</label>
            <input
              value={editedData.booking_link}
              onChange={e => update('booking_link', e.target.value)}
              className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 text-sm"
              placeholder="https://calendly.com/yourbusiness"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Business Hours *</label>
          <textarea
            value={editedData.hours}
            onChange={e => update('hours', e.target.value)}
            rows={3}
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 text-sm resize-none"
            placeholder="Monday-Friday: 9:00 AM - 5:00 PM&#10;Saturday: 10:00 AM - 2:00 PM&#10;Sunday: Closed"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Location / Address</label>
          <input
            value={editedData.locations.join(', ')}
            onChange={e => update('locations', e.target.value ? [e.target.value] : [])}
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 text-sm"
            placeholder="123 Main St, City, State 12345"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Business Summary</label>
          <textarea
            value={editedData.summary}
            onChange={e => update('summary', e.target.value)}
            rows={3}
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 text-sm resize-none"
            placeholder="Brief description of what your business does..."
          />
        </div>
      </div>

      {/* Services */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-white text-lg border-b border-white/10 pb-3">Services Offered</h3>
        
        <div className="flex flex-wrap gap-2">
          {editedData.services.map((service, i) => (
            <div key={i} className={`flex items-center gap-2 ${nicheConfig.bgColor} border ${nicheConfig.borderColor} rounded-full px-3 py-1.5 text-sm`}>
              <span className={nicheConfig.color}>{service}</span>
              <button
                onClick={() => removeService(i)}
                className="text-slate-500 hover:text-red-400 transition-colors ml-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={newService}
            onChange={e => setNewService(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addService()}
            placeholder="Add a service..."
            className="flex-1 bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 text-sm"
          />
          <button
            onClick={addService}
            className={`${nicheConfig.bgColor} ${nicheConfig.color} border ${nicheConfig.borderColor} rounded-xl px-4 py-2.5 text-sm font-medium hover:opacity-80 transition-opacity`}
          >
            + Add
          </button>
        </div>
      </div>

      {/* FAQs */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-white text-lg border-b border-white/10 pb-3">
          FAQs <span className="text-xs text-slate-500 font-normal ml-2">(The agent will answer these questions)</span>
        </h3>
        
        {editedData.faq.map((faq, i) => (
          <div key={i} className="bg-dark-900 rounded-xl p-4 relative group">
            <button
              onClick={() => removeFaq(i)}
              className="absolute top-3 right-3 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
            >
              ×
            </button>
            <div className="text-green-400 text-sm font-medium mb-1">Q: {faq.question}</div>
            <div className="text-slate-400 text-sm">A: {faq.answer}</div>
          </div>
        ))}

        <div className="space-y-2">
          <input
            value={newFaqQ}
            onChange={e => setNewFaqQ(e.target.value)}
            placeholder="Question..."
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 text-sm"
          />
          <input
            value={newFaqA}
            onChange={e => setNewFaqA(e.target.value)}
            placeholder="Answer..."
            className="w-full bg-dark-900 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-green-500/50 text-sm"
          />
          <button
            onClick={addFaq}
            className="text-sm text-green-400 hover:text-green-300 transition-colors"
          >
            + Add FAQ
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onBack}
          className="flex-1 bg-dark-800 border border-white/10 text-slate-300 hover:text-white font-medium py-3 px-6 rounded-xl transition-all"
        >
          ← Back
        </button>
        <button
          onClick={() => onConfirm(editedData)}
          disabled={!editedData.business_name}
          className="flex-1 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <span>Launch Demo Call</span>
          <span>📞</span>
        </button>
      </div>
    </div>
  );
}
