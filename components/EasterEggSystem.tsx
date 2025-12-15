
import React, { useState, useEffect, useCallback } from 'react';
import { Star, Sparkles, X, Lock, Cpu } from 'lucide-react';

// Easter Egg Schema
export const EASTER_EGG_SCHEMA = {
  comets: {
    ids: ['comet-1', 'comet-2', 'comet-3'],
    name: 'Comet Trilogy',
    discovered: [] as string[],
  },
  constellations: {
    ids: ['constellation-orion', 'constellation-cassiopeia'],
    name: 'Star Mapper',
    discovered: [] as string[],
  },
  anomalies: {
    ids: ['black-hole', 'wormhole'],
    name: 'Cosmic Phenomena',
    discovered: [] as string[],
  }
};

export const TOTAL_EGGS = 7;

interface EasterEggSystemProps {
  onDiscovery: (count: number) => void;
}

const EasterEggSystem: React.FC<EasterEggSystemProps> = ({ onDiscovery }) => {
  const [discovered, setDiscovered] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ title: string, message: string, isSpecial?: boolean } | null>(null);
  const [showFinale, setShowFinale] = useState(false);
  const [accessCode] = useState(() => 'CC-' + Math.random().toString(36).substring(2, 8).toUpperCase());

  // Listen for discoveries from other components (like Comets)
  useEffect(() => {
    const handleEggDiscovery = (e: CustomEvent) => {
      const eggId = e.detail.eggId;
      if (!eggId) return;

      if (eggId === 'KONAMI_CODE') {
          setNotification({
              title: 'GOD MODE ACTIVATED',
              message: 'Time Dilation Limit Removed. 5.0x Enabled.',
              isSpecial: true
          });
          return;
      }
      
      setDiscovered(prev => {
        if (prev.includes(eggId)) return prev;
        
        const newDiscovered = [...prev, eggId];
        const count = newDiscovered.length;
        
        // Notify parent
        onDiscovery(count);
        
        // Show Toast
        setNotification({
            title: 'Anomaly Detected',
            message: `Secure Log: ${count}/${TOTAL_EGGS} Secrets Found`
        });

        // Check Finale
        if (count === TOTAL_EGGS) {
            setTimeout(() => setShowFinale(true), 1500);
        }

        // Save to local storage
        localStorage.setItem('easter_egg_progress', JSON.stringify(newDiscovered));
        
        return newDiscovered;
      });
    };

    window.addEventListener('discovery', handleEggDiscovery as EventListener);
    
    // Load initial state
    const saved = localStorage.getItem('easter_egg_progress');
    if (saved) {
        const parsed = JSON.parse(saved);
        setDiscovered(parsed);
        onDiscovery(parsed.length);
    }

    return () => window.removeEventListener('discovery', handleEggDiscovery as EventListener);
  }, [onDiscovery]);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
        const timer = setTimeout(() => setNotification(null), 4000);
        return () => clearTimeout(timer);
    }
  }, [notification]);

  const triggerDiscovery = (id: string) => {
      const event = new CustomEvent('discovery', { detail: { eggId: id } });
      window.dispatchEvent(event);
  };

  return (
    <>
      {/* Constellation 1: Hidden Click Zone (Orion) - Top Right */}
      {!discovered.includes('constellation-orion') && (
        <div 
            className="fixed top-[15%] right-[10%] w-24 h-24 cursor-crosshair z-10 opacity-0 hover:opacity-100 transition-opacity duration-1000"
            onClick={() => triggerDiscovery('constellation-orion')}
        >
            <div className="absolute w-1 h-1 bg-white top-2 left-2 shadow-[0_0_10px_white]"></div>
            <div className="absolute w-1 h-1 bg-white top-8 left-8 shadow-[0_0_10px_white]"></div>
            <div className="absolute w-1 h-1 bg-white top-14 left-14 shadow-[0_0_10px_white]"></div>
            <div className="text-[9px] text-blue-400 font-mono mt-16 ml-2">UNIDENTIFIED SIGNAL</div>
        </div>
      )}

      {/* Constellation 2: Hidden Click Zone (Cassiopeia) - Bottom Left */}
      {!discovered.includes('constellation-cassiopeia') && (
        <div 
            className="fixed bottom-[20%] left-[10%] w-24 h-24 cursor-crosshair z-10 opacity-0 hover:opacity-100 transition-opacity duration-1000"
            onClick={() => triggerDiscovery('constellation-cassiopeia')}
        >
             <svg width="100" height="100" className="absolute inset-0">
                <path d="M10,20 L30,60 L50,40 L70,60 L90,20" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
                <circle cx="10" cy="20" r="1.5" fill="white" />
                <circle cx="30" cy="60" r="1.5" fill="white" />
                <circle cx="50" cy="40" r="1.5" fill="white" />
                <circle cx="70" cy="60" r="1.5" fill="white" />
                <circle cx="90" cy="20" r="1.5" fill="white" />
             </svg>
             <div className="text-[9px] text-purple-400 font-mono mt-20 text-center">ANOMALY DETECTED</div>
        </div>
      )}
      
      {/* Anomaly 1: Black Hole (Tiny pixel in center that distorts when hovered) */}
      {!discovered.includes('black-hole') && (
          <div 
            className="fixed top-[10%] left-[50%] w-4 h-4 -ml-2 cursor-pointer z-10 group"
            onClick={() => triggerDiscovery('black-hole')}
          >
              <div className="w-full h-full rounded-full bg-black border border-gray-800 group-hover:scale-[5] transition-transform duration-500 relative overflow-hidden">
                 <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 animate-pulse"></div>
              </div>
          </div>
      )}
      
      {/* Anomaly 2: Wormhole (Random flicker) */}
      {!discovered.includes('wormhole') && (
          <div 
             className="fixed bottom-[10%] right-[50%] w-8 h-8 cursor-help z-10 animate-pulse"
             style={{ animationDuration: '0.2s' }}
             onClick={() => triggerDiscovery('wormhole')}
          >
              <div className="w-1 h-1 bg-red-500 rounded-full absolute top-1/2 left-1/2 filter blur-sm"></div>
          </div>
      )}

      {/* Discovery Notification */}
      {notification && (
        <div className="fixed top-24 right-6 z-[9999] animate-slide-in-right">
            <div className={`bg-gray-900/90 border ${notification.isSpecial ? 'border-red-500/50 text-red-400' : 'border-yellow-500/50 text-yellow-500'} p-4 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-xl flex items-center gap-4`}>
                <div className={`p-2 rounded-full ${notification.isSpecial ? 'bg-red-500/20' : 'bg-yellow-500/20'}`}>
                    {notification.isSpecial ? <Cpu size={20} /> : <Sparkles size={20} />}
                </div>
                <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider">{notification.title}</h4>
                    <p className={`text-xs font-mono ${notification.isSpecial ? 'text-red-200/80' : 'text-yellow-200/80'}`}>{notification.message}</p>
                </div>
            </div>
        </div>
      )}

      {/* Grand Finale Modal */}
      {showFinale && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="bg-gray-950 border-2 border-blue-500/50 rounded-2xl p-10 max-w-2xl text-center relative shadow-[0_0_100px_rgba(59,130,246,0.3)] overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                 
                 <div className="relative z-10">
                     <div className="mb-6 flex justify-center">
                         <Star size={48} className="text-yellow-400 animate-spin-slow" style={{ animationDuration: '12s' }} fill="currentColor" />
                     </div>
                     
                     <h1 className="text-3xl md:text-4xl font-light font-mono text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 mb-6 tracking-widest uppercase">
                         Alignment Complete
                     </h1>
                     
                     <p className="text-gray-400 text-sm mb-8 font-light leading-relaxed font-mono">
                         All 7 anomalies have been cataloged. You have unlocked the inner mysteries of the system.
                     </p>
                     
                     {/* Reward / Beta Message */}
                     <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl mb-8 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-2 text-xs text-gray-600 font-mono border-l border-b border-gray-800">BETA-0.9.2</div>
                         <div className="flex flex-col items-center gap-3">
                             <Lock size={24} className="text-gray-500 mb-1" />
                             <h3 className="text-gray-300 font-mono uppercase tracking-widest text-sm">Reward System Testing</h3>
                             <p className="text-gray-500 text-xs">The reward delivery protocol is currently in beta. Please retain this access code for future redemption.</p>
                             
                             <div className="mt-2 px-6 py-3 bg-black border border-blue-500/30 rounded font-mono text-blue-400 tracking-[0.2em] text-lg select-all">
                                {accessCode}
                             </div>
                         </div>
                     </div>
                     
                     <button 
                        onClick={() => setShowFinale(false)}
                        className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 mx-auto text-xs uppercase tracking-widest"
                     >
                         <X size={14} /> Terminate Connection
                     </button>
                 </div>
            </div>
        </div>
      )}
    </>
  );
};

export default EasterEggSystem;
