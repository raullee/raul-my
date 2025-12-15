import React, { useState, useEffect } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';
import { Activity, ChevronUp, ChevronDown, Globe, AlignCenter } from 'lucide-react';
import ClickableWrapper from './ClickableWrapper';

// J2000.0 Epoch (January 1, 2000, 12:00 TT)
const BASE_J2000_ALIGNMENTS = 8492;

interface SystemCycleTrackerProps {
    timeScale: number;
    elapsedTime: number;
    liveConjunctionCount?: number;
}

const SystemCycleTracker: React.FC<SystemCycleTrackerProps> = ({ timeScale, elapsedTime, liveConjunctionCount = 0 }) => {
  const { width } = useWindowSize();
  const [predictedDate, setPredictedDate] = useState<Date | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updatePrediction = () => {
      const CYCLE_SECONDS = 37800;
      const secondsInCurrentCycle = elapsedTime % CYCLE_SECONDS;
      const secondsRemaining = CYCLE_SECONDS - secondsInCurrentCycle;
      
      if (timeScale <= 0) {
          setPredictedDate(null);
      } else {
          const realSecondsToWait = secondsRemaining / timeScale;
          setPredictedDate(new Date(Date.now() + realSecondsToWait * 1000));
      }
    };

    updatePrediction();
    const interval = setInterval(updatePrediction, 1000);
    return () => clearInterval(interval);
  }, [timeScale, elapsedTime]);

  const totalAlignments = BASE_J2000_ALIGNMENTS + liveConjunctionCount;

  return (
    <ClickableWrapper tooltipText={isExpanded ? "Minimize Status" : "System Status"}>
        <div className="flex flex-col items-start gap-2">
            {/* Collapsible Content (Expands Upwards) */}
            {isExpanded && (
                <div className="mb-2 p-3 rounded-lg bg-gray-900/80 border border-gray-800 backdrop-blur-md shadow-lg animate-fade-in-up origin-bottom min-w-[200px]">
                    <div className="flex items-center justify-between border-b border-gray-700 pb-2 mb-2">
                         <span className="font-mono text-[10px] text-gray-400 uppercase tracking-wider">Conjunctions</span>
                         <Globe size={12} className="text-blue-400" />
                    </div>
                    
                    <div className="flex flex-col mb-3">
                        <span className="text-[9px] text-gray-600 uppercase mb-0.5">J2000.0 Epoch Count</span>
                        <div className="text-white font-mono text-sm tabular-nums tracking-wider">
                            {totalAlignments.toLocaleString()}
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-[9px] text-gray-600 uppercase mb-0.5">Next Alignment</span>
                         {predictedDate ? (
                            <div className="text-blue-300 font-mono text-xs leading-tight">
                                {predictedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} <span className="opacity-50">|</span> {predictedDate.toLocaleTimeString()}
                            </div>
                        ) : (
                            <div className="text-orange-400 font-mono text-xs">SIMULATION PAUSED</div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Toggle Button */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className={`flex items-center gap-2 p-2 bg-gray-900/80 border rounded-lg backdrop-blur-md transition-colors group w-full ${isExpanded ? 'border-blue-500/50 text-blue-400' : 'border-gray-800 text-gray-400 hover:border-gray-600'}`}
            >
                <div className="relative">
                    <AlignCenter size={14} className={isExpanded ? 'text-blue-400' : 'text-gray-400'} />
                    {timeScale > 0 && !isExpanded && (
                        <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></span>
                    )}
                </div>
                
                <span className="text-[10px] font-mono uppercase tracking-widest whitespace-nowrap">
                    SYSTEM STATUS
                </span>
                
                <div className="ml-2">
                    {isExpanded ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
                </div>
            </button>
        </div>
        <style>{`
            @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up {
                animation: fade-in-up 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
        `}</style>
    </ClickableWrapper>
  );
};

export default SystemCycleTracker;