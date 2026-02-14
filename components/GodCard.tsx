import React, { useState, useEffect } from 'react';
import { God } from '../types';
import { Feather, ImageOff } from 'lucide-react';

interface GodCardProps {
  god: God;
  mode: 'greek' | 'roman';
  onClick: (god: God) => void;
  small?: boolean;
}

export const GodCard: React.FC<GodCardProps> = ({ god, mode, onClick, small = false }) => {
  const currentName = mode === 'greek' ? god.greekName : god.romanName;
  const Icon = god.icon;
  
  const [hasError, setHasError] = useState(false);

  // Reset state when god changes
  useEffect(() => {
    setHasError(false);
  }, [god.image]);

  return (
    <div 
      onClick={() => onClick(god)}
      className={`
        group relative bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-300
        ${small ? 'w-32 flex-shrink-0' : 'w-full'}
        border border-stone-300 shadow-sm
        hover:shadow-lg hover:-translate-y-1 hover:border-amber-400
      `}
    >
      <div className={`relative ${small ? 'h-32' : 'h-80'} bg-stone-200 overflow-hidden`}>
        {god.plathPoems && god.plathPoems.length > 0 && (
          <div className="absolute top-2 right-2 text-rose-900 bg-white/90 p-1.5 rounded-full shadow-sm border border-rose-100 z-30 transform group-hover:scale-110 transition-transform" title="Appears in Sylvia Plath's Poetry">
            <Feather size={14} className="stroke-2" />
          </div>
        )}

        {(!hasError && god.image) ? (
          <>
             <img 
               src={god.image} 
               alt={currentName} 
               onError={() => setHasError(true)}
               loading="eager"
               className={`
                 w-full h-full object-cover object-top
                 group-hover:scale-105 filter sepia-[0.1] contrast-[1.05]
                 transition-all duration-700
               `} 
             />
             {/* Gradient for text readability */}
             <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent z-10 pointer-events-none"></div>
          </>
        ) : (
          // Fallback Card
          <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${god.color} relative overflow-hidden group-hover:bg-stone-800 transition-colors duration-500`}>
             <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
             
             <div className="relative z-10 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-2">
                <Icon size={small ? 20 : 32} strokeWidth={1.5} />
             </div>
             
             {!small && (
               <div className="text-center px-4">
                 <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest block mb-0.5">Image Unavailable</span>
                 <ImageOff size={16} className="text-white/40 mx-auto mt-2" />
               </div>
             )}
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 w-full p-4 z-20">
           <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
             <h3 className={`${small ? 'text-xs' : 'text-xl'} font-serif font-bold text-stone-50 tracking-wide uppercase drop-shadow-md`}>
               {currentName}
             </h3>
             {!small && (
               <div className="inline-block mt-1 px-2 py-0.5 bg-stone-900/50 backdrop-blur-md text-amber-100 text-[10px] font-bold uppercase tracking-widest border border-stone-500/30 rounded-full">
                 {god.domain}
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};