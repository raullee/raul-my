
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';
import { Sparkles, LocateFixed, Calendar, Clock } from 'lucide-react';

type CometType = 'ice' | 'fire' | 'void';

interface CometVisuals {
  type: CometType;
  color: string;
  coreColor: string;
  tailGradient: string;
}

interface CometData {
  name: string;
  composition: string;
  origin: string;
  lastFlyby: string;
  nextFlyby: string;
  period: string;
  visualType: CometType; // Maps to a visual style
  size: number;
  speedBase: number; // duration in ms
}

// Visual Archetypes
const VISUAL_STYLES: Record<CometType, CometVisuals> = {
  ice: {
    type: 'ice',
    color: '#a5f3fc', // Light Cyan
    coreColor: '#fff',
    tailGradient: 'linear-gradient(90deg, rgba(165, 243, 252, 0) 0%, rgba(165, 243, 252, 0.2) 50%, rgba(255, 255, 255, 0.8) 100%)'
  },
  fire: {
    type: 'fire',
    color: '#fb923c', // Orange
    coreColor: '#ffedd5',
    tailGradient: 'linear-gradient(90deg, rgba(251, 146, 60, 0) 0%, rgba(234, 88, 12, 0.4) 40%, rgba(255, 237, 213, 0.9) 100%)'
  },
  void: {
    type: 'void',
    color: '#d8b4fe', // Purple
    coreColor: '#f3e8ff',
    tailGradient: 'linear-gradient(90deg, rgba(147, 51, 234, 0) 0%, rgba(168, 85, 247, 0.3) 50%, rgba(255, 255, 255, 0.7) 100%)'
  }
};

// Real Astronomical Data
const REAL_COMETS: CometData[] = [
  {
    name: '1P/Halley',
    composition: 'Ice, silicate dust',
    origin: 'Kuiper Belt',
    lastFlyby: '1986',
    nextFlyby: '2061',
    period: '76 years',
    visualType: 'ice',
    size: 4,
    speedBase: 4000
  },
  {
    name: 'C/2020 F3 (NEOWISE)',
    composition: 'Sodium rich, dust',
    origin: 'Oort Cloud',
    lastFlyby: 'July 2020',
    nextFlyby: 'c. 8786',
    period: '6,766 years',
    visualType: 'fire',
    size: 5,
    speedBase: 3500
  },
  {
    name: 'C/1995 O1 (Hale-Bopp)',
    composition: 'Water ice, CO, dust',
    origin: 'Oort Cloud',
    lastFlyby: 'April 1997',
    nextFlyby: 'c. 4385',
    period: '2,533 years',
    visualType: 'void',
    size: 6,
    speedBase: 5000
  }
];

interface ActiveCometState {
  style: React.CSSProperties;
  data: CometData;
  visuals: CometVisuals;
  id: number;
  eggId: string; // ID for easter egg tracking
}

interface CometProps {
    onCapture?: () => void;
}

const Comet: React.FC<CometProps> = ({ onCapture }) => {
  const { width, height } = useWindowSize();
  const [activeComet, setActiveComet] = useState<ActiveCometState | null>(null);
  const [capturedData, setCapturedData] = useState<{ x: number, y: number, state: ActiveCometState } | null>(null);
  
  const activeCometRef = useRef(false);
  // Cycle through the 3 required comets for the easter egg
  const cometIndexRef = useRef(0);

  useEffect(() => {
    activeCometRef.current = !!activeComet;
  }, [activeComet]);
  
  const triggerComet = useCallback(() => {
    if (activeCometRef.current) return;

    // Pick sequentially to ensure all can be caught
    const index = cometIndexRef.current % REAL_COMETS.length;
    const cometData = REAL_COMETS[index];
    cometIndexRef.current += 1;

    const visuals = VISUAL_STYLES[cometData.visualType];
    
    const side = Math.floor(Math.random() * 4); 
    let startX, startY, endX, endY;
    const padding = 200;

    switch (side) {
      case 0: // Top -> Bottom
        startX = Math.random() * width; startY = -padding;
        endX = Math.random() * width; endY = height + padding;
        break;
      case 1: // Right -> Left
        startX = width + padding; startY = Math.random() * height;
        endX = -padding; endY = Math.random() * height;
        break;
      case 2: // Bottom -> Top
        startX = Math.random() * width; startY = height + padding;
        endX = Math.random() * width; endY = -padding;
        break;
      default: // Left -> Right
        startX = -padding; startY = Math.random() * height;
        endX = width + padding; endY = Math.random() * height;
        break;
    }

    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
    const duration = cometData.speedBase + (Math.random() * 1000 - 500);

    setActiveComet({
      data: cometData,
      visuals: visuals,
      id: Date.now(),
      eggId: `comet-${index + 1}`, // comet-1, comet-2, comet-3
      style: {
        left: `${startX}px`,
        top: `${startY}px`,
        '--target-x': `${endX - startX}px`,
        '--target-y': `${endY - startY}px`,
        transform: `rotate(${angle}deg)`,
        animationDuration: `${duration}ms`,
      } as React.CSSProperties
    });
  }, [width, height]);

  useEffect(() => {
    const initialTimeout = setTimeout(triggerComet, 8000);
    let loopId: ReturnType<typeof setTimeout>;
    
    const scheduleNext = () => {
      const delay = 15000 + Math.random() * 30000;
      loopId = setTimeout(() => {
        if (!capturedData) {
            triggerComet();
        }
        scheduleNext();
      }, delay);
    };
    
    scheduleNext();

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(loopId);
    };
  }, [triggerComet, capturedData]);

  const handleCapture = (e: React.MouseEvent) => {
    if (!activeComet) return;
    e.stopPropagation();
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    
    setCapturedData({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      state: activeComet
    });

    if (onCapture) onCapture();
    
    // Trigger Easter Egg Discovery
    const event = new CustomEvent('discovery', { detail: { eggId: activeComet.eggId } });
    window.dispatchEvent(event);
  };

  const closeCapture = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCapturedData(null);
  };

  const handleAnimationEnd = () => {
    if (!capturedData) {
        setActiveComet(null);
    }
  };

  if (!activeComet) return null;

  const isRightSide = capturedData && capturedData.x > width / 2;
  const popupOffsetX = isRightSide ? -240 : 100; 
  const lineEndX = isRightSide ? capturedData?.x! - 100 : capturedData?.x! + 100;
  
  const displayState = capturedData ? capturedData.state : activeComet;

  return (
    <>
      <style>{`
        @keyframes comet-move {
          from { transform: translate(0, 0) var(--tw-rotate); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          to { transform: translate(var(--target-x), var(--target-y)) var(--tw-rotate); opacity: 0; }
        }
        .animate-comet {
          animation-name: comet-move;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
        .comet-interactive:hover {
            animation-play-state: paused;
        }
      `}</style>
      
      {capturedData && (
          <div 
            className="fixed inset-0 z-40 cursor-pointer" 
            onClick={(e) => closeCapture(e)}
            title="Click to resume simulation"
          />
      )}

      <div
        className={`fixed z-20 animate-comet cursor-crosshair group comet-interactive ${capturedData ? 'pointer-events-none' : ''}`}
        style={{
            ...activeComet.style,
            '--tw-rotate': activeComet.style.transform,
            transform: 'none',
            animationPlayState: capturedData ? 'paused' : undefined 
        } as React.CSSProperties}
        onClick={handleCapture}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className="relative p-8 -m-8">
            <div 
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full z-10" 
                style={{ 
                    width: `${displayState.data.size}px`, 
                    height: `${displayState.data.size}px`,
                    backgroundColor: displayState.visuals.coreColor,
                    boxShadow: `0 0 ${displayState.data.size * 4}px 2px ${displayState.visuals.color}, 0 0 ${displayState.data.size * 10}px 4px ${displayState.visuals.color}`
                }} 
            />
            
            <div 
                className="absolute right-0 top-1/2 -translate-y-1/2 origin-right" 
                style={{
                    width: '250px',
                    height: `${displayState.data.size * 3}px`,
                    background: displayState.visuals.tailGradient,
                    filter: 'blur(2px)',
                    transform: 'translateX(-2px)'
                }}
            />
            
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 border border-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-[-50%] scale-50 group-hover:scale-100 flex items-center justify-center">
                <LocateFixed size={12} className="text-white/70 animate-pulse" />
            </div>
        </div>
      </div>

      {capturedData && (
        <>
            <svg className="fixed inset-0 z-40 pointer-events-none">
                <defs>
                    <marker id="dot" markerWidth="6" markerHeight="6" refX="3" refY="3">
                        <circle cx="3" cy="3" r="2" fill={displayState.visuals.color} />
                    </marker>
                </defs>
                <path 
                    d={`M${capturedData.x},${capturedData.y} L${isRightSide ? capturedData.x - 50 : capturedData.x + 50},${capturedData.y - 50} L${lineEndX},${capturedData.y - 50}`}
                    fill="none"
                    stroke={displayState.visuals.color}
                    strokeWidth="1"
                    markerStart="url(#dot)"
                    className="animate-[dash_0.5s_ease-out]"
                />
            </svg>

            <div 
                className="fixed z-50 cursor-default animate-fade-in"
                style={{ 
                    left: capturedData.x + popupOffsetX, 
                    top: capturedData.y - 100
                }}
                onClick={(e) => e.stopPropagation()}
            >
            <div 
                className={`bg-black/90 ${isRightSide ? 'border-r-2 rounded-l text-right' : 'border-l-2 rounded-r'} p-4 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)] min-w-[220px] max-w-[260px]`}
                style={{ 
                    borderColor: displayState.visuals.color,
                    boxShadow: `0 0 20px ${displayState.visuals.color}20`
                }}
            >
                <div className={`flex items-center ${isRightSide ? 'justify-end' : 'justify-between'} mb-2 border-b border-gray-800 pb-2 gap-4`}>
                    <div className={`flex items-center gap-2 ${isRightSide ? 'flex-row-reverse' : ''}`}>
                        <Sparkles size={14} style={{ color: displayState.visuals.color }} />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">{displayState.data.name}</span>
                    </div>
                    <span className="text-[9px] font-mono text-gray-500">LIVE</span>
                </div>
                
                <div className="text-[10px] text-gray-400 font-mono space-y-1.5">
                     <div className="flex justify-between gap-4">
                        <span>VISUAL ID:</span>
                        <span className="text-gray-300 uppercase">{displayState.eggId}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span>ORIGIN:</span>
                        <span className="text-gray-300">{displayState.data.origin}</span>
                    </div>
                    <div className="flex justify-between gap-4 items-center">
                        <span className="flex items-center gap-1"><Clock size={10}/> NEXT:</span>
                        <span className="text-blue-300 font-semibold">{displayState.data.nextFlyby}</span>
                    </div>
                </div>
            </div>
            </div>
        </>
      )}
    </>
  );
};

export default Comet;
