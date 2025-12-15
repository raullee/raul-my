import React, { useState, useEffect } from 'react';
import type { PlanetData } from '../types';
import { ExternalLink, X, Info } from 'lucide-react';

interface DetailPanelProps {
  planet: PlanetData;
  onClose: () => void;
  onShowInfo: () => void;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ planet, onClose, onShowInfo }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
      onClick={onClose}
    >
      <div
        className={`relative bg-gradient-to-br from-gray-950 to-black rounded-xl p-6 sm:p-8 transition-all duration-500 max-w-2xl w-full overflow-hidden ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{
          boxShadow: `0 0 60px ${planet.color}20, inset 0 0 40px ${planet.color}10`,
          border: `2px solid ${planet.color}30`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors z-20"
        >
          <X size={20} />
        </button>
        
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
            <div
                className="text-[15rem] sm:text-[20rem] font-mono opacity-5 select-none"
                style={{ color: planet.color, transform: 'rotate(-15deg) scale(1.2)' }}
            >
                {planet.astronomy.symbol}
            </div>
        </div>

        <div className="relative z-10">
            <div
            className="inline-block px-3 py-1 rounded-full text-xs mb-4 font-light"
            style={{ backgroundColor: `${planet.color}15`, borderColor: `${planet.color}30`, borderWidth: '1px', color: planet.color }}
            >
            {planet.category}
            </div>

            <h2 className="text-4xl sm:text-5xl font-extralight mb-2 tracking-tight" style={{ color: planet.color }}>
            {planet.name}
            </h2>

            <div className="text-gray-500 text-sm mb-6 font-light">
            {planet.fullName}
            </div>

            <p className="text-gray-400 leading-relaxed mb-8 font-light text-base sm:text-lg">
            {planet.description}
            </p>

            <div className="flex flex-col gap-3">
                <a
                href={`https://${planet.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all font-light hover:scale-105"
                style={{ backgroundColor: `${planet.color}15`, borderColor: `${planet.color}30`, borderWidth: '1px', color: planet.color }}
                >
                <span className="font-mono text-sm">{planet.url}</span>
                <ExternalLink size={16} />
                </a>

                <button
                onClick={onShowInfo}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all font-light hover:scale-105"
                style={{ backgroundColor: `${planet.color}20`, borderColor: `${planet.color}40`, borderWidth: '1px', color: planet.color }}
                >
                <Info size={16} />
                View Planetary Data
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;