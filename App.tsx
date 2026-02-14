import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Users, GitMerge, Search, ArrowUp, ArrowDown, X, Feather, Play, Square, Loader2, HelpCircle, MousePointerClick, Heart, Info, Edit2 } from 'lucide-react';
import { GodCard } from './components/GodCard';
import { EditGodModal } from './components/EditGodModal';
import { PasswordModal } from './components/PasswordModal';
import { godsData as initialGodsData } from './data';
import { plathPoemsData } from './poems';
import { God } from './types';
import { GoogleGenAI, Modality } from "@google/genai";

// --- Visual Asset Components ---
const StoneTexture: React.FC = () => (
  <div className="fixed inset-0 opacity-[0.04] pointer-events-none z-0 mix-blend-multiply" 
       style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
  </div>
);

const GreekPattern: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`h-3 w-full opacity-20 ${className}`} style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='10' viewBox='0 0 40 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10h10V0h10v10h10V0h10' stroke='%2378350f' fill='none' stroke-width='2'/%3E%3C/svg%3E")`,
    backgroundSize: '40px 10px'
  }} />
);

const DoricColumn: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 60 800" className={className} preserveAspectRatio="none">
    {/* Base */}
    <rect x="5" y="780" width="50" height="20" fill="currentColor" />
    <rect x="10" y="770" width="40" height="10" fill="currentColor" opacity="0.9" />
    {/* Shaft */}
    <rect x="12" y="60" width="36" height="710" fill="currentColor" opacity="0.8" />
    {/* Fluting */}
    <line x1="18" y1="60" x2="18" y2="770" stroke="white" strokeWidth="1" opacity="0.2" />
    <line x1="24" y1="60" x2="24" y2="770" stroke="white" strokeWidth="1" opacity="0.2" />
    <line x1="30" y1="60" x2="30" y2="770" stroke="white" strokeWidth="1" opacity="0.2" />
    <line x1="36" y1="60" x2="36" y2="770" stroke="white" strokeWidth="1" opacity="0.2" />
    <line x1="42" y1="60" x2="42" y2="770" stroke="white" strokeWidth="1" opacity="0.2" />
    {/* Capital */}
    <path d="M10 40 L50 40 L45 60 L15 60 Z" fill="currentColor" />
    <rect x="5" y="20" width="50" height="20" fill="currentColor" />
  </svg>
);

const LaurelWreath: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 50" className={className} fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 40 C 20 50, 40 50, 50 40 C 60 50, 80 50, 90 40" strokeOpacity="0.5" />
    <path d="M10 40 Q 5 20 20 10" strokeLinecap="round" />
    <path d="M90 40 Q 95 20 80 10" strokeLinecap="round" />
    <path d="M15 35 Q 10 25 25 25" strokeLinecap="round" />
    <path d="M85 35 Q 90 25 75 25" strokeLinecap="round" />
    <path d="M25 30 Q 20 15 35 15" strokeLinecap="round" />
    <path d="M75 30 Q 80 15 65 15" strokeLinecap="round" />
  </svg>
);

// --- Legend Component ---
const LineageLegend: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="absolute bottom-16 right-0 mb-2 z-30 w-72 animate-in slide-in-from-bottom-5 fade-in duration-300 origin-bottom-right">
    <div className="bg-stone-50/95 backdrop-blur-md border-2 border-stone-200 rounded-xl shadow-2xl p-5 relative overflow-hidden">
      <GreekPattern className="absolute top-0 left-0 w-full opacity-10" />
      <button onClick={onClose} className="absolute top-2 right-2 text-stone-400 hover:text-stone-600 transition-colors">
        <X size={16} />
      </button>
      
      <h4 className="font-serif font-bold text-stone-800 mb-4 flex items-center gap-2 text-xs uppercase tracking-widest border-b border-stone-200 pb-2">
        <GitMerge size={14} className="text-amber-600" /> Lineage Guide
      </h4>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3 group">
          <div className="w-8 h-8 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center shrink-0 group-hover:border-amber-300 transition-colors">
            <ArrowUp size={16} className="text-stone-400 group-hover:text-amber-600" />
          </div>
          <div>
            <span className="font-serif font-bold block text-stone-800 text-sm">Ancestors</span>
            <p className="text-[11px] text-stone-500 leading-tight mt-0.5">Parents and Titans listed at the top. Click arrow to ascend tree.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 group">
          <div className="w-8 h-8 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center shrink-0 group-hover:border-rose-300 transition-colors">
            <Heart size={14} className="text-rose-400 group-hover:text-rose-600" />
          </div>
          <div>
            <span className="font-serif font-bold block text-stone-800 text-sm">Consorts</span>
            <p className="text-[11px] text-stone-500 leading-tight mt-0.5">Partners and lovers displayed to the side of the focused god.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 group">
          <div className="w-8 h-8 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center shrink-0 group-hover:border-amber-300 transition-colors">
            <ArrowDown size={16} className="text-stone-400 group-hover:text-amber-600" />
          </div>
          <div>
            <span className="font-serif font-bold block text-stone-800 text-sm">Descendants</span>
            <p className="text-[11px] text-stone-500 leading-tight mt-0.5">Children listed at the bottom. Click arrow to descend tree.</p>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-3 border-t border-stone-200/60 mt-2 bg-stone-100/50 -mx-5 px-5 pb-1 mb-0">
          <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0 mt-1">
            <MousePointerClick size={16} className="text-amber-700" />
          </div>
          <div className="mt-1">
            <span className="font-serif font-bold block text-stone-800 text-sm">Interactive</span>
            <p className="text-[11px] text-stone-500 leading-tight mt-0.5">Click any God Card to make them the focus of the lineage tree.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Audio Helper Functions ---
function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function pcmToAudioBuffer(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export default function App() {
  const [gods, setGods] = useState<God[]>(initialGodsData);
  const [mode, setMode] = useState<'greek' | 'roman'>('greek'); 
  const [view, setView] = useState<'gallery' | 'tree'>('gallery'); 
  const [selectedGod, setSelectedGod] = useState<God | null>(null);
  
  // Edit & Auth State
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [viewingPoem, setViewingPoem] = useState<string | null>(null);
  const [treeFocusId, setTreeFocusId] = useState<number>(1); 
  const [searchTerm, setSearchTerm] = useState('');
  
  // UI State
  const [showLegend, setShowLegend] = useState(false);

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const filteredGods = gods.filter(god => {
    const name = mode === 'greek' ? god.greekName : god.romanName;
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           god.domain.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const focusGod = gods.find(g => g.id === treeFocusId);
  
  // Safe navigation for tree
  const parents = focusGod?.family.parents.map(id => gods.find(g => g.id === id)).filter((g): g is God => !!g) || [];
  const partners = focusGod?.family.partners.map(id => gods.find(g => g.id === id)).filter((g): g is God => !!g) || [];
  const children = focusGod?.family.children.map(id => gods.find(g => g.id === id)).filter((g): g is God => !!g) || [];

  const handleTreeNavigate = (id: number) => setTreeFocusId(id);
  const currentName = (god: God) => mode === 'greek' ? god.greekName : god.romanName;

  const handleUpdateGod = (updatedGod: God) => {
    setGods(prevGods => prevGods.map(g => g.id === updatedGod.id ? updatedGod : g));
    setSelectedGod(updatedGod);
    setIsEditing(false);
  };

  const initiateEdit = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    setIsEditing(true);
  };

  // Stop audio when modal closes or unmounts
  const stopAudio = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {
        // Ignore errors if already stopped
      }
      audioSourceRef.current = null;
    }
    setIsPlaying(false);
    setIsLoadingAudio(false);
  };

  const handleClosePoem = () => {
    stopAudio();
    setViewingPoem(null);
  };

  const handlePlayPoem = async (text: string) => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    setIsLoadingAudio(true);

    try {
      if (!process.env.API_KEY) {
        throw new Error("API Key is missing. Please check your configuration.");
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        throw new Error("No audio data returned from Gemini. The request may have been filtered.");
      }

      // Initialize AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      }
      const ctx = audioContextRef.current;
      
      // Resume context if suspended (browser requirement for audio playback)
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const audioBytes = base64ToUint8Array(base64Audio);
      const audioBuffer = await pcmToAudioBuffer(audioBytes, ctx, 24000, 1);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      source.onended = () => {
        setIsPlaying(false);
      };

      audioSourceRef.current = source;
      source.start();
      setIsPlaying(true);

    } catch (error) {
      console.error("Error generating speech:", error);
      alert("Unable to generate audio. " + (error instanceof Error ? error.message : "Please check your connection or API key."));
    } finally {
      setIsLoadingAudio(false);
    }
  };

  // Cleanup effect
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-amber-200 pb-20 relative overflow-x-hidden">
      <StoneTexture />
      
      {/* Decorative Columns (Desktop) */}
      <div className="fixed inset-0 pointer-events-none z-0 hidden 2xl:block px-8 max-w-[1600px] mx-auto">
         <DoricColumn className="absolute left-8 top-32 bottom-0 w-20 text-stone-200 opacity-60" />
         <DoricColumn className="absolute right-8 top-32 bottom-0 w-20 text-stone-200 opacity-60" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full bg-stone-50/90 backdrop-blur-md border-b-2 border-double border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => {setView('gallery'); setTreeFocusId(1);}}>
            <div className="relative">
               <LaurelWreath className="absolute -left-3 -top-2 w-16 h-12 text-amber-500/20 group-hover:text-amber-500/40 transition-colors" />
               <div className="p-2 bg-stone-900 rounded-lg text-amber-400 border border-amber-600 relative z-10"><BookOpen size={24} /></div>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-stone-800 font-serif">MYTHOS <span className="text-amber-600 italic">Explorer</span></h1>
          </div>
          <div className="flex items-center gap-2 md:gap-6 bg-white p-1.5 rounded-full border border-stone-200 shadow-sm">
            <div className="flex bg-stone-100 rounded-full p-1">
              <button onClick={() => setView('gallery')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${view === 'gallery' ? 'bg-white shadow text-stone-900 ring-1 ring-stone-200' : 'text-stone-400 hover:text-stone-600'}`}><Users size={14} /> Gallery</button>
              <button onClick={() => setView('tree')} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${view === 'tree' ? 'bg-white shadow text-stone-900 ring-1 ring-stone-200' : 'text-stone-400 hover:text-stone-600'}`}><GitMerge size={14} /> Lineage</button>
            </div>
            <div className="flex gap-2 pr-2">
               <button onClick={() => setMode('greek')} className={`text-xs font-bold transition-colors ${mode === 'greek' ? 'text-amber-600' : 'text-stone-400 hover:text-stone-600'}`}>GR</button>
               <span className="text-stone-300">|</span>
               <button onClick={() => setMode('roman')} className={`text-xs font-bold transition-colors ${mode === 'roman' ? 'text-amber-600' : 'text-stone-400 hover:text-stone-600'}`}>RO</button>
            </div>
          </div>
        </div>
        <GreekPattern />
      </nav>

      {/* Content */}
      <div className="relative z-10">
      {view === 'gallery' ? (
        <main className="max-w-6xl mx-auto px-4 py-12">
            <div className="mb-12 text-center relative">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-24 bg-amber-500/5 blur-3xl rounded-full pointer-events-none"></div>
                 <LaurelWreath className="w-32 h-16 text-stone-200 mx-auto mb-2 opacity-80" />
                 <h2 className="text-4xl md:text-5xl font-serif text-stone-800 mb-6 font-bold tracking-tight drop-shadow-sm">{mode === 'greek' ? 'The Olympian Pantheon' : 'Dii Consentes'}</h2>
                 <div className="relative w-full max-w-lg mx-auto group">
                    <input 
                      type="text" 
                      placeholder="Search gods, domains..." 
                      value={searchTerm} 
                      onChange={(e) => setSearchTerm(e.target.value)} 
                      className="w-full px-6 py-3 pl-12 bg-white/80 backdrop-blur-sm border-2 border-stone-200 rounded-full text-stone-700 shadow-sm focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 transition-all placeholder:text-stone-400" 
                    />
                    <Search className="absolute left-4 top-3.5 text-stone-400 group-focus-within:text-amber-500 transition-colors" size={20} />
                 </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredGods.map((god) => (<GodCard key={god.id} god={god} mode={mode} onClick={setSelectedGod} />))}
              {filteredGods.length === 0 && (
                <div className="col-span-full text-center py-20 text-stone-400 flex flex-col items-center">
                  <Feather size={48} className="mb-4 opacity-20" />
                  <p className="font-serif italic text-xl">"The gods are silent."</p>
                  <p className="text-sm mt-2">No deities found matching your search.</p>
                </div>
              )}
            </div>
        </main>
      ) : (
        <main className="max-w-6xl mx-auto px-4 py-8 flex flex-col items-center">
          <div className="text-center mb-10">
            <LaurelWreath className="w-24 h-12 text-stone-200 mx-auto mb-2 opacity-80" />
            <h2 className="text-3xl font-serif font-bold text-stone-800">Divine Lineage</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
               <span className="h-px w-8 bg-stone-300"></span>
               <p className="text-xs text-stone-500 uppercase tracking-widest font-bold">Focus: {focusGod ? currentName(focusGod) : 'Unknown'}</p>
               <span className="h-px w-8 bg-stone-300"></span>
            </div>
          </div>
          
          {focusGod ? (
            <div className="w-full max-w-4xl relative min-h-[600px] flex flex-col items-center justify-center py-10">
              {/* Legend for Tree View */}
              <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
                {showLegend && <LineageLegend onClose={() => setShowLegend(false)} />}
                <button 
                  onClick={() => setShowLegend(!showLegend)}
                  className="p-3 bg-stone-800 text-amber-50 rounded-full shadow-xl hover:bg-stone-700 hover:scale-110 transition-all ring-2 ring-stone-900 ring-offset-2 z-40"
                  aria-label="Toggle Lineage Legend"
                >
                  {showLegend ? <X size={24} /> : <HelpCircle size={24} />}
                </button>
              </div>

              {/* Parents */}
              <div className="flex gap-12 mb-16 relative z-10">
                {parents.length > 0 ? parents.map(p => (
                  <div key={p.id} className="flex flex-col items-center gap-3 group">
                    <GodCard god={p} mode={mode} onClick={() => handleTreeNavigate(p.id)} small />
                    <div className="w-px h-8 bg-gradient-to-b from-transparent to-amber-400/50"></div>
                    <ArrowUp size={24} className="text-stone-300 group-hover:text-amber-500 group-hover:-translate-y-1 transition-all" />
                  </div>
                )) : (
                  <div className="text-stone-400 text-xs italic px-6 py-3 border border-stone-200 rounded-full bg-white/60 shadow-sm backdrop-blur-sm font-serif">Primordial Origin</div>
                )}
              </div>
              
              {/* Focus & Partners */}
              <div className="flex flex-col md:flex-row items-center gap-12 relative z-10 mb-16">
                 <div className="transform scale-110 shadow-2xl rounded-lg ring-4 ring-amber-400/30 z-20">
                   <GodCard god={focusGod} mode={mode} onClick={() => setSelectedGod(focusGod)} />
                 </div>
                 {partners.length > 0 && (
                   <div className="flex flex-col items-center gap-3 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-stone-200 border-dashed shadow-sm">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest bg-stone-100 px-2 py-0.5 rounded-full">Consorts</span>
                      <div className="flex gap-4 flex-wrap justify-center">
                        {partners.map(p => (
                          <div key={p.id} className="scale-90 opacity-80 hover:opacity-100 hover:scale-100 transition-all duration-300">
                            <GodCard god={p} mode={mode} onClick={() => handleTreeNavigate(p.id)} small />
                          </div>
                        ))}
                      </div>
                   </div>
                 )}
              </div>
              
              {/* Children */}
              <div className="flex gap-6 flex-wrap justify-center relative z-10 border-t-2 border-stone-100 pt-10 w-full">
                {children.length > 0 ? children.map(c => (
                  <div key={c.id} className="flex flex-col items-center gap-3 group">
                    <ArrowDown size={24} className="text-stone-300 group-hover:text-amber-500 group-hover:translate-y-1 transition-all" />
                    <div className="w-px h-8 bg-gradient-to-t from-transparent to-amber-400/50"></div>
                    <GodCard god={c} mode={mode} onClick={() => handleTreeNavigate(c.id)} small />
                  </div>
                )) : (
                  <div className="text-stone-400 text-xs italic font-serif">No Olympian offspring recorded</div>
                )}
              </div>
              
              {/* Connecting Lines (Visual Decor) */}
              <div className="absolute inset-0 pointer-events-none z-0 flex justify-center items-center">
                  <div className="w-px h-3/4 bg-stone-200/50 absolute top-12" />
                  <div className="w-3/4 h-px bg-stone-200/50 absolute top-1/2" />
              </div>
            </div>
          ) : (
            <div>God not found</div>
          )}
        </main>
      )}
      </div>

      {/* Password Modal */}
      <PasswordModal 
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={handlePasswordSuccess}
      />

      {/* Edit God Modal */}
      {isEditing && selectedGod && (
        <EditGodModal 
          god={selectedGod} 
          onSave={handleUpdateGod} 
          onCancel={() => setIsEditing(false)} 
        />
      )}

      {/* Detail Modal */}
      {selectedGod && !isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedGod(null)}></div>
          <div className="relative bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-fade-in-up border-4 border-stone-200">
            <button onClick={() => setSelectedGod(null)} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white z-20 transition-colors"><X size={20} /></button>
            
            <div className="w-full md:w-1/2 relative h-64 md:h-auto bg-stone-200">
              {selectedGod.image ? (
                <img src={selectedGod.image} alt={currentName(selectedGod)} className="w-full h-full object-cover filter contrast-110 sepia-[0.2]" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${selectedGod.color}`} />
              )}
              <div className="absolute bottom-0 left-0 p-8 text-white bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent w-full">
                <h2 className="text-5xl font-serif font-bold mb-2 text-amber-50 tracking-tight">{currentName(selectedGod)}</h2>
                <div className="w-12 h-1 bg-amber-500 mb-3"></div>
                <p className="italic font-serif text-lg text-amber-100/90 leading-tight">"{selectedGod.quote}"</p>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 p-8 bg-stone-50 overflow-y-auto flex flex-col relative">
               <GreekPattern className="absolute top-0 left-0 w-full opacity-10" />
               
               <div className="mb-8 z-10 relative">
                 <div className="flex justify-between items-start">
                   <div>
                     <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-600"></span> Title
                     </h3>
                     <p className="text-3xl font-serif text-stone-800">{selectedGod.title}</p>
                   </div>
                   <button 
                     onClick={initiateEdit}
                     className="p-2 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-all"
                     title="Edit Details"
                   >
                     <Edit2 size={18} />
                   </button>
                 </div>
               </div>

               <div className="mb-8 z-10">
                 <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Lore</h3>
                 <p className="text-stone-700 leading-relaxed text-lg font-light font-serif">{selectedGod.desc}</p>
               </div>

               {selectedGod.plathPoems && selectedGod.plathPoems.length > 0 && (
                 <div className="mb-6 z-10 bg-rose-50 border border-rose-200 rounded-xl p-5 shadow-sm">
                   <div className="flex items-center gap-2 mb-3 text-rose-800 border-b border-rose-100 pb-2">
                     <Feather size={18} />
                     <h3 className="font-serif font-bold tracking-wide">Sylvia Plath's Reference</h3>
                   </div>
                   <ul className="text-sm text-rose-800 font-medium space-y-2">
                     {selectedGod.plathPoems.map(poem => (
                       <li key={poem}>
                         <button 
                            onClick={() => plathPoemsData[poem] && setViewingPoem(poem)}
                            className={`text-left hover:text-rose-600 transition-colors flex items-center gap-2 w-full group ${plathPoemsData[poem] ? 'cursor-pointer' : 'cursor-default'}`}
                         >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 group-hover:scale-125 transition-transform" />
                            <span className="italic group-hover:underline decoration-rose-300 underline-offset-2">{poem}</span>
                            <Play size={12} className="ml-auto opacity-0 group-hover:opacity-50" />
                         </button>
                       </li>
                     ))}
                   </ul>
                 </div>
               )}
               
               <div className="grid grid-cols-2 gap-4 text-sm text-stone-600 mb-8 z-10">
                 <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm hover:border-amber-200 transition-colors">
                    <span className="font-bold block text-stone-400 text-[10px] uppercase tracking-wider mb-1">Symbol</span>
                    <div className="flex items-center gap-2 text-stone-800">
                        <selectedGod.symbolIcon size={20} className="text-amber-600" />
                        <span className="font-serif text-xl">{selectedGod.symbol}</span>
                    </div>
                 </div>
                 <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm hover:border-amber-200 transition-colors">
                    <span className="font-bold block text-stone-400 text-[10px] uppercase tracking-wider mb-1">Sacred Animal</span>
                    <div className="flex items-center gap-2 text-stone-800">
                        <selectedGod.animalIcon size={20} className="text-amber-600" />
                        <span className="font-serif text-xl">{selectedGod.animal}</span>
                    </div>
                 </div>
               </div>
               
               <div className="mt-auto z-10 space-y-3">
                 {view === 'tree' && selectedGod.id !== treeFocusId && (
                    <button 
                      onClick={() => { handleTreeNavigate(selectedGod.id); setSelectedGod(null); }} 
                      className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-amber-50 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors uppercase tracking-widest text-xs"
                    >
                      <GitMerge size={16} /> Focus Lineage
                    </button>
                 )}
                 {view === 'gallery' && (
                   <button 
                    onClick={() => { setView('tree'); handleTreeNavigate(selectedGod.id); setSelectedGod(null); }} 
                    className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors uppercase tracking-widest text-xs"
                  >
                    <GitMerge size={16} /> View in Lineage
                  </button>
                 )}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Poem Reading Modal */}
      {viewingPoem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm transition-opacity" onClick={handleClosePoem}></div>
          <div className="relative bg-rose-50 w-full max-w-2xl rounded-xl shadow-2xl border-4 border-white overflow-hidden flex flex-col max-h-[85vh]">
             <div className="flex items-center justify-between p-4 border-b border-rose-200 bg-white/50 backdrop-blur-sm">
               <h3 className="font-serif font-bold text-xl text-rose-900">{viewingPoem}</h3>
               <div className="flex items-center gap-2">
                 <button 
                   onClick={() => handlePlayPoem(plathPoemsData[viewingPoem])}
                   disabled={isLoadingAudio}
                   className={`
                     flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                     ${isPlaying 
                       ? 'bg-rose-200 text-rose-800 hover:bg-rose-300 ring-2 ring-rose-300' 
                       : 'bg-rose-900 text-white hover:bg-rose-800 shadow-lg hover:shadow-xl hover:-translate-y-0.5'}
                     disabled:opacity-50 disabled:cursor-not-allowed
                   `}
                 >
                   {isLoadingAudio ? (
                     <>
                       <Loader2 size={14} className="animate-spin" />
                       Loading Audio...
                     </>
                   ) : isPlaying ? (
                     <>
                       <Square size={14} fill="currentColor" />
                       Stop Reading
                     </>
                   ) : (
                     <>
                       <Play size={14} fill="currentColor" />
                       Listen to Poem
                     </>
                   )}
                 </button>
                 <button onClick={handleClosePoem} className="p-2 hover:bg-rose-200 rounded-full text-rose-800 transition-colors"><X size={20} /></button>
               </div>
             </div>
             <div className="p-10 overflow-y-auto font-poem text-rose-950 leading-relaxed text-2xl whitespace-pre-wrap">
               {plathPoemsData[viewingPoem]}
             </div>
             <div className="p-3 text-center text-xs text-rose-400 bg-white/50 border-t border-rose-200 uppercase tracking-widest font-serif">
               Sylvia Plath
             </div>
          </div>
        </div>
      )}
    </div>
  );
}