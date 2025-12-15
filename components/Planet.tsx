
import React from 'react';
import type { PlanetData } from '../types';
import ElectricBorder from './ElectricBorder';
import { Info } from 'lucide-react';
import ClickableWrapper from './ClickableWrapper';
import StatusBadge from './StatusBadge';

interface PlanetProps {
  planet: PlanetData;
  orbitAngle: number;
  rotationAngle: number;
  active: boolean;
  onClick: () => void;
  onHover: () => void;
  onLeave: () => void;
  onInfoClick: () => void;
  centerX: number;
  centerY: number;
  baseRadius: number;
  width: number;
  orbitScale: number;
}

const Planet: React.FC<PlanetProps> = ({
  planet, orbitAngle, rotationAngle, active,
  onClick, onHover, onLeave, onInfoClick,
  centerX, centerY, baseRadius, width,
  orbitScale
}) => {
  const orbitRadius = baseRadius * planet.orbit * orbitScale;
  
  const x = centerX + Math.cos((orbitAngle * Math.PI) / 180) * orbitRadius;
  const y = centerY + Math.sin((orbitAngle * Math.PI) / 180) * orbitRadius;
  
  const sizeMultiplier = width < 768 ? 28 : 55;
  const minSize = width < 768 ? 28 : 20; 
  const size = Math.max(minSize, (planet.size / 100) * sizeMultiplier);

  const isTilted = planet.planet.tilt;

  return (
    <div
      className="absolute group primary-element"
      style={{
        transform: `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`,
        left: 0, 
        top: 0,
        zIndex: active ? 100 : 50,
        willChange: 'transform'
      }}
      data-project={planet.id} // For Deep Linking
    >
      <ClickableWrapper 
        tooltipText={`Explore: ${planet.name}`} 
        onClick={onClick}
        className="relative"
      >
        <div 
            className="relative transition-transform duration-300 ease-out"
            style={{ transform: active ? 'scale(1.15)' : 'scale(1)' }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
        >
            {/* Status Badge */}
            {planet.status && <StatusBadge status={planet.status} />}

            <ElectricBorder color={planet.color} active={active} className="relative">
                {/* Main Planet Visual */}
                <div
                    className="rounded-full flex items-center justify-center text-white font-light shadow-2xl relative overflow-hidden"
                    style={{
                        width: size, height: size,
                        background: planet.planet.texture,
                        boxShadow: active ? `0 0 50px ${planet.color}70, 0 0 100px ${planet.color}50, inset 0 0 40px ${planet.color}30` : `0 0 30px ${planet.color}40, inset 0 0 30px rgba(0,0,0,0.5)`,
                        transform: isTilted ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'box-shadow 0.3s ease-out'
                    }}
                >
                    {/* Surface Texture */}
                    <div 
                        className="absolute inset-0 rounded-full opacity-60 mix-blend-overlay pointer-events-none"
                        style={{
                            transform: `rotate(${rotationAngle}deg)`,
                            background: planet.planet.bands 
                                ? `repeating-linear-gradient(0deg, transparent, transparent 10%, rgba(0,0,0,0.5) 10%, rgba(0,0,0,0.5) 12%)`
                                : `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.8'/%3E%3C/svg%3E"), conic-gradient(from 0deg, transparent 0deg, rgba(0,0,0,0.4) 90deg, transparent 180deg, rgba(255,255,255,0.15) 270deg)`
                        }}
                    />

                    {/* Atmosphere */}
                    {planet.planet.atmosphere && (
                        <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: `inset 0 0 ${size * 0.25}px ${planet.color}80` }} />
                    )}

                    {/* Shadow */}
                    <div 
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                            background: 'radial-gradient(circle at 30% 30%, transparent 50%, rgba(0,0,0,0.6) 85%, rgba(0,0,0,0.8) 100%)',
                            transform: isTilted ? 'rotate(-90deg)' : 'none'
                        }} 
                    />
                </div>
                
                {/* Rings */}
                {planet.planet.rings && (
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none secondary-element"
                        style={{
                            width: size * 2.4, height: size * 2.4,
                            borderRadius: '50%',
                            transform: isTilted ? 'translate(-50%, -50%) rotateZ(90deg) rotateX(75deg)' : 'translate(-50%, -50%) rotateX(75deg)',
                            boxShadow: isTilted ? `2px 0 10px ${planet.color}40` : `0 2px 10px ${planet.color}40`
                        }}
                    >
                        <div className="absolute inset-0 rounded-full border-[3px] border-opacity-30" 
                            style={{ borderColor: planet.color, borderWidth: Math.max(2, size * 0.15), opacity: 0.6 }} 
                        />
                    </div>
                )}
            </ElectricBorder>

            {/* Info Button */}
            <button
                onClick={(e) => { e.stopPropagation(); onInfoClick(); }}
                className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-30 hover:bg-gray-900 secondary-element"
                style={{ border: `1px solid ${planet.color}`, boxShadow: `0 0 10px ${planet.color}40` }}
                title="View astronomy data"
            >
                <Info size={12} style={{ color: planet.color }} />
            </button>
        </div>
      </ClickableWrapper>
    </div>
  );
};

export default Planet;
