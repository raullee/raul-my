
import React, { useState, useEffect } from 'react';
import type { PlanetData } from '../types';
import { X, ExternalLink, Music, Copyright, List } from 'lucide-react';

interface SiteInfoPanelProps {
  planets: PlanetData[];
  onClose: () => void;
}

const SiteInfoPanel: React.FC<SiteInfoPanelProps> = ({ planets, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const sortedPlanets = [...planets].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.98)' }}
      onClick={onClose}
    >
      <div
        className={`relative bg-black/40 border border-gray-800 rounded-xl shadow-2xl transition-all duration-500 max-h-[95vh] sm:max-h-[90vh] max-w-7xl w-full flex flex-col backdrop-blur-sm ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{ WebkitOverflowScrolling: 'touch' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 sm:p-6 flex-shrink-0 border-b border-gray-800/50 flex justify-between items-start">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extralight text-purple-300 tracking-tight">Site Directory</h2>
            <p className="text-gray-500 font-light mt-1 text-xs sm:text-sm md:text-base">All projects within this system.</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-white transition-colors z-10 p-1.5 sm:p-2 hover:bg-white/10 rounded-full"
        >
          <X size={20} className="sm:w-6 sm:h-6" />
        </button>

        <div className="overflow-y-auto p-3 sm:p-6 flex-grow min-h-0" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 md:gap-6">
            {sortedPlanets.map(planet => (
              <a
                key={planet.id}
                href={`https://${planet.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-md sm:rounded-lg border border-gray-800 bg-gray-900/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20"
              >
                <div className="aspect-video overflow-hidden">
                    <img
                        src={planet.thumbnailUrl}
                        alt={`${planet.name} thumbnail`}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-2 sm:p-4 w-full">
                    <div className="flex justify-between items-end">
                        <div>
                            <h3 className="text-sm sm:text-lg font-medium text-gray-200 group-hover:text-white transition-colors truncate">{planet.name}</h3>
                            <p
                                className="text-[10px] sm:text-xs font-mono uppercase tracking-wider mt-0.5 sm:mt-1"
                                style={{ color: planet.color }}
                            >
                                {planet.category}
                            </p>
                        </div>
                    </div>
                </div>
                 <div className="absolute top-1 right-1 sm:top-2 sm:right-2 p-1 sm:p-2 bg-black/60 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 border border-gray-700">
                    <ExternalLink size={10} className="text-white sm:w-[14px] sm:h-[14px]" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer - Compact on mobile */}
        <div className="p-2 sm:p-4 border-t border-gray-800/50 bg-black/90 rounded-b-xl flex-shrink-0 backdrop-blur-md flex flex-col gap-2 sm:gap-4">

            {/* Featured Alternate Index Link */}
            <div className="flex justify-center w-full">
                <a
                    href="https://linktr.ee/raullee"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 sm:px-8 py-2 sm:py-3 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700 hover:border-gray-500 transition-all duration-300 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-gray-300 hover:text-white shadow-lg hover:shadow-purple-500/20 group"
                >
                    <List size={12} className="text-purple-400 group-hover:text-purple-300 sm:w-[14px] sm:h-[14px]" />
                    <span>View on Linktree</span>
                    <ExternalLink size={10} className="text-gray-500 group-hover:text-white transition-colors ml-1 sm:w-[12px] sm:h-[12px]" />
                </a>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 text-[10px] sm:text-xs font-light text-gray-400 px-2 border-t border-gray-800/50 pt-2 sm:pt-4 w-full">
                <div className="flex items-center gap-2">
                    <Copyright size={10} className="sm:w-[12px] sm:h-[12px]" />
                    <span className="font-mono uppercase tracking-wider">Axon Avenue PLT</span>
                </div>

                <div className="flex flex-col items-center sm:items-end gap-1">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Music size={10} className="sm:w-[12px] sm:h-[12px]" />
                        <span className="hidden sm:inline">Audio: "Marconi Union - Weightless"</span>
                        <span className="sm:hidden">Weightless - Marconi Union</span>
                    </div>
                    <a
                        href="https://britishacademyofsoundtherapy.com/research/weightless-marconi-union-ft-lyz-cooper/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[9px] sm:text-[10px] text-gray-600 hover:text-blue-400 transition-colors flex items-center gap-1 border-b border-transparent hover:border-blue-400/50 pb-0.5"
                    >
                        Clinical Study <ExternalLink size={8} />
                    </a>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SiteInfoPanel;
