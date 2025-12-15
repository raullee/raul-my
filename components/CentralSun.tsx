import React, { useState, useEffect } from 'react';
import { useScramble } from '../hooks/useScramble';
import { useWindowSize } from '../hooks/useWindowSize';
import { Info, Sparkles } from 'lucide-react';
import ClickableWrapper from './ClickableWrapper';

interface CentralSunProps {
  onMarcoClick?: () => void;
}

const CentralSun: React.FC<CentralSunProps> = ({ onMarcoClick }) => {
  const [pulsePhase, setPulsePhase] = useState(0);
  const { width } = useWindowSize();
  
  const { text: raulText, start: startRaul, stop: stopRaul } = useScramble('raul', { speed: 30 });
  const { text: myText, start: startMy, stop: stopMy } = useScramble('.my', { speed: 30 });

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setPulsePhase(prev => (prev + 0.5) % 360);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseEnter = () => {
    startRaul();
    startMy();
  };

  const handleMouseLeave = () => {
    stopRaul();
    stopMy();
  };
  
  const isMobile = width < 768;
  const baseSize = isMobile ? 80 : 140; 
  const ringBaseSize = isMobile ? 110 : 180;

  const pulseScale = 1 + Math.sin((pulsePhase / 180) * Math.PI) * 0.02;

  return (
    <div 
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
    >
      <div className="relative group">
        {/* Ambient Rings */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full pointer-events-none ambient-element"
            style={{
              width: ringBaseSize + i * (isMobile ? 28 : 40),
              height: ringBaseSize + i * (isMobile ? 28 : 40),
              top: '50%', left: '50%',
              transform: `translate(-50%, -50%) rotate(${pulsePhase * (i + 1) * 0.5}deg)`,
              border: `1px solid rgba(249, 115, 22, ${0.2 - i * 0.05})`,
              boxShadow: '0 0 15px rgba(249, 115, 22, 0.2)',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
        
        {/* Sun Body - Primary Element */}
        <div className="pointer-events-auto">
          <ClickableWrapper tooltipText="Talk to Marco ✨" className="rounded-full">
            <div
              className="relative rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 primary-element"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={onMarcoClick}
              style={{
                width: baseSize,
                height: baseSize,
                background: 'radial-gradient(circle at center, #f97316 0%, #ea580c 40%, #a855f7 90%)',
                boxShadow: '0 0 70px rgba(249, 115, 22, 0.7), 0 0 40px rgba(168, 85, 247, 0.5), inset 0 0 50px rgba(245, 158, 11, 0.5)',
                transform: `scale(${pulseScale})`
              }}
            >
              {/* AI Badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-2 py-1 flex items-center gap-1 shadow-lg animate-pulse z-20 pointer-events-none border border-purple-300/50">
                <Sparkles size={12} className="text-white" />
                <span className="text-[8px] font-bold text-white uppercase tracking-wider">AI</span>
              </div>

              <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, transparent 70%)', filter: 'blur(30px)', transform: 'scale(1.3)', transition: 'transform 0.3s ease' }} />

              <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
                <div
                  className="font-mono font-bold tracking-tight mb-1 transition-all duration-300"
                  style={{
                    fontSize: isMobile ? '1.5rem' : '2rem',
                    background: 'linear-gradient(135deg, #fdba74 0%, #f0abfc 100%)',
                    backgroundSize: '200% 200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    filter: `brightness(1.6) drop-shadow(0 0 25px rgba(245, 158, 11, 0.8))`
                  }}
                >
                  {raulText}
                </div>
                <div
                  className="text-[10px] font-mono tracking-[0.5em] transition-all duration-300 uppercase opacity-80"
                  style={{ color: '#fed7aa', textShadow: 'none' }}
                >
                  {myText}
                </div>
                <div className="text-[7px] font-mono tracking-widest transition-all duration-300 uppercase opacity-70 mt-1" style={{ color: '#d946ef', textShadow: '0 0 10px rgba(217, 70, 239, 0.8)' }}>
                  Talk to Marco
                </div>
              </div>
            </div>
          </ClickableWrapper>
        </div>
      </div>
    </div>
  );
};

export default CentralSun;