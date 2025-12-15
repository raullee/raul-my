
import React, { useState, useEffect } from 'react';
import { X, Mail } from 'lucide-react';

interface SmartCTAProps {
  planetsVisited: number;
}

const SmartCTA: React.FC<SmartCTAProps> = ({ planetsVisited }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    // Show if visited 3 or more planets and hasn't dismissed
    if (planetsVisited >= 3 && !hasDismissed && !isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [planetsVisited, hasDismissed, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 right-6 z-[60] animate-slide-in-right">
      <div className="bg-gray-900/95 border border-blue-500/50 rounded-xl p-6 shadow-2xl backdrop-blur-xl max-w-xs relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none" />
        
        <button 
          onClick={() => {
            setIsVisible(false);
            setHasDismissed(true);
          }}
          className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        <div className="relative z-10">
          <h3 className="text-blue-400 font-mono text-sm uppercase tracking-widest mb-1">Collab Request</h3>
          <p className="text-gray-300 text-sm font-light mb-4 leading-relaxed">
            You've been exploring deeply. Interested in collaborating on Music, Tech, or Law?
          </p>
          
          <a 
            href="mailto:hello@raul.my"
            className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40"
          >
            <Mail size={14} />
            Get in Touch
          </a>
        </div>
      </div>
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default SmartCTA;
