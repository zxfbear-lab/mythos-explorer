import React, { useState } from 'react';
import { Lock, X, ArrowRight, ShieldAlert } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded password for demonstration
    if (password.toLowerCase() === 'ariel') {
      onSuccess();
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-sm rounded-xl shadow-2xl border-4 border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-stone-100 p-4 border-b border-stone-200 flex justify-between items-center">
          <div className="flex items-center gap-2 text-stone-700 font-serif font-bold">
            <Lock size={18} className="text-amber-600" />
            <span>Restricted Access</span>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-amber-100">
              <ShieldAlert size={24} className="text-amber-600" />
            </div>
            <p className="text-stone-600 text-sm">
              Please enter the divine passkey to modify the archives.
            </p>
            <p className="text-xs text-stone-400 mt-1">(Hint: Sylvia's horse)</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter password..."
                className={`w-full px-4 py-2.5 bg-white border-2 rounded-lg outline-none transition-all font-serif placeholder:font-sans
                  ${error 
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10' 
                    : 'border-stone-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10'
                  }
                `}
                autoFocus
              />
            </div>
            
            {error && (
              <p className="text-xs text-rose-600 font-bold flex items-center justify-center gap-1 animate-in slide-in-from-top-1">
                Access Denied. Incorrect Passkey.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-50 rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:shadow-md active:scale-95 uppercase tracking-wider text-xs"
            >
              Verify Identity <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};