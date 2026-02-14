import React, { useState } from 'react';
import { God } from '../types';
import { X, Save, Disc } from 'lucide-react';

interface EditGodModalProps {
  god: God;
  onSave: (updatedGod: God) => void;
  onCancel: () => void;
}

export const EditGodModal: React.FC<EditGodModalProps> = ({ god, onSave, onCancel }) => {
  const [formData, setFormData] = useState<God>(god);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-sm" onClick={onCancel}></div>
      
      <div className="relative bg-stone-50 w-full max-w-2xl rounded-xl shadow-2xl border-4 border-stone-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
              <Disc size={20} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl text-stone-800">Edit Records</h3>
              <p className="text-xs text-stone-500 uppercase tracking-widest">Modifying Divine Archives</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <form id="edit-god-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Names Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Greek Name</label>
                <input
                  type="text"
                  name="greekName"
                  value={formData.greekName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-serif"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Roman Name</label>
                <input
                  type="text"
                  name="romanName"
                  value={formData.romanName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-serif"
                />
              </div>
            </div>

            {/* Titles & Domain */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Domain</label>
                <input
                  type="text"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Mythological Description</label>
              <textarea
                name="desc"
                value={formData.desc}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-serif leading-relaxed resize-none"
              />
            </div>

            {/* Quote */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Quote</label>
              <textarea
                name="quote"
                value={formData.quote}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-3 bg-stone-100 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all font-serif italic text-stone-700 resize-none"
              />
            </div>

            {/* Attributes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Symbol (Text)</label>
                <input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Animal (Text)</label>
                <input
                  type="text"
                  name="animal"
                  value={formData.animal}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                />
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-stone-200 bg-stone-50 rounded-b-lg flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-200 hover:text-stone-800 transition-colors uppercase tracking-wider"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="edit-god-form"
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 uppercase tracking-wider"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};