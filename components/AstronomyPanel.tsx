
import React, { useState, useEffect } from 'react';
import type { PlanetData } from '../types';
import { X, BookOpen, Orbit, Activity, Sparkles, Wind, ArrowLeft, ExternalLink } from 'lucide-react';

interface AstronomyPanelProps {
  planet: PlanetData | null;
  onClose: () => void;
  showBack: boolean;
  onBack: () => void;
  onShowProject?: () => void;
}

const AstronomyPanel: React.FC<AstronomyPanelProps> = ({ planet, onClose, showBack, onBack, onShowProject }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (planet) {
      setActiveTab('overview'); // Reset tab on new planet
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [planet]);

  if (!planet) return null;

  // Only show navigation if we can go back OR if there is a project link available (onShowProject is defined)
  const showNavigation = showBack || !!onShowProject;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
      onClick={onClose}
    >
      <div
        className={`relative bg-gradient-to-br from-gray-950 to-black rounded-xl p-6 md:p-8 transition-all duration-500 max-h-[90vh] overflow-y-auto max-w-5xl w-full ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{
          boxShadow: `0 0 60px ${planet.color}30, inset 0 0 40px ${planet.color}10`,
          border: `2px solid ${planet.color}30`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4 sm:gap-6 mb-8">
          <div
            className="w-16 h-16 sm:w-24 sm:h-24 rounded-full flex-shrink-0 flex items-center justify-center text-3xl sm:text-5xl"
            style={{
              background: planet.planet.texture,
              boxShadow: `0 0 40px ${planet.color}50, inset 0 0 30px ${planet.color}30`
            }}
          >
            {planet.astronomy.symbol}
          </div>
          <div className="flex-1">
             {/* Navigation Header - Conditionally rendered */}
             {showNavigation && (
             <div className="flex items-center mb-2">
                <button 
                  onClick={showBack ? onBack : onShowProject} 
                  className="flex items-center gap-1 text-blue-400 hover:text-white transition-colors pr-3 mr-3 border-r border-gray-700 group"
                  title={showBack ? "Return to Project Details" : "View Project Portfolio"}
                >
                  {showBack ? (
                    <>
                       <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                       <span className="text-sm font-bold tracking-wide uppercase">Back to Project</span>
                    </>
                  ) : (
                    <>
                        <span className="text-sm font-bold tracking-wide uppercase">View Project Details</span>
                        <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
            </div>
            )}

            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-extralight tracking-tight"
                style={{ color: planet.color }}
              >
                {planet.astronomy.realName}
              </h2>
            </div>
            <div className="text-gray-400 text-sm md:text-base font-light mt-1">
              {planet.name} • {planet.fullName}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-gray-800 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'orbital', label: 'Orbital Data', icon: Orbit },
            { id: 'scientific', label: 'Scientific', icon: Activity }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-light transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-b-2 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              style={{
                borderColor: activeTab === tab.id ? planet.color : 'transparent'
              }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[300px]">
          {activeTab === 'overview' && (
            <div className="animate-fade-in space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Distance from Sun", value: planet.astronomy.distanceFromSun },
                  { label: "Diameter", value: planet.astronomy.diameter },
                  { label: "Temperature", value: planet.astronomy.temperature },
                  { label: "Moons", value: planet.astronomy.moons },
                  { label: "Orbital Period", value: planet.astronomy.orbitalPeriod },
                  { label: "Rotation Period", value: planet.astronomy.rotationPeriod },
                ].map(item => (
                    <div key={item.label}>
                      <div className="text-xs text-gray-600 mb-1 font-light uppercase tracking-wider">{item.label}</div>
                      <div className="text-base sm:text-lg font-light" style={{ color: planet.color }}>{item.value}</div>
                    </div>
                ))}
              </div>

              <div
                  className="p-4 sm:p-6 rounded-lg"
                  style={{
                    backgroundColor: `${planet.color}05`,
                    borderColor: `${planet.color}20`,
                    borderWidth: '1px'
                  }}
                >
                  <div className="text-sm text-gray-500 mb-3 font-light uppercase tracking-wider flex items-center gap-2">
                      <Wind size={16} />
                      Today's Weather
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                          <div className="text-xs text-gray-600">Conditions</div>
                          <div className="text-sm sm:text-base font-light text-gray-300">{planet.astronomy.weather.today}</div>
                      </div>
                      <div>
                          <div className="text-xs text-gray-600">Wind Speed</div>
                          <div className="text-sm sm:text-base font-light text-gray-300">{planet.astronomy.weather.windSpeed}</div>
                      </div>
                      <div className="sm:col-span-3">
                          <div className="text-xs text-gray-600 mt-2">Forecast</div>
                          <div className="text-sm sm:text-base font-light text-gray-400 leading-relaxed">{planet.astronomy.weather.forecast}</div>
                      </div>
                  </div>
              </div>
              
              <div>
                <div className="text-xs text-gray-600 mb-3 font-light uppercase tracking-wider">Key Facts</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {planet.astronomy.facts.map((fact, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 rounded-lg font-light text-sm flex items-start gap-2"
                      style={{
                        backgroundColor: `${planet.color}10`,
                        borderColor: `${planet.color}30`,
                        borderWidth: '1px',
                        color: '#d1d5db'
                      }}
                    >
                      <Sparkles size={14} className="flex-shrink-0 mt-0.5" style={{ color: planet.color }} />
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'orbital' && (
             <div className="animate-fade-in space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: `${planet.color}05`, borderColor: `${planet.color}20`, borderWidth: '1px' }}
                >
                  <div className="text-sm text-gray-500 mb-4 font-light uppercase tracking-wider flex items-center gap-2"><Orbit size={16} />Orbital Mechanics</div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-gray-600 font-light">Orbital Period</div>
                      <div className="text-xl font-light" style={{ color: planet.color }}>{planet.astronomy.orbitalPeriod}</div>
                      <div className="text-xs text-gray-500 mt-1">Animation speed: {planet.orbitSpeed}s per orbit</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 font-light">Distance from Sun</div>
                      <div className="text-xl font-light" style={{ color: planet.color }}>{planet.astronomy.distanceFromSun}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 font-light">Orbit Position</div>
                      <div className="text-lg font-light text-gray-400">Ring #{planet.orbit} from center</div>
                    </div>
                  </div>
                </div>
                
                <div 
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: `${planet.color}05`, borderColor: `${planet.color}20`, borderWidth: '1px' }}
                >
                  <div className="text-sm text-gray-500 mb-4 font-light uppercase tracking-wider flex items-center gap-2"><Activity size={16} />Rotation</div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-gray-600 font-light">Rotation Period</div>
                      <div className="text-xl font-light" style={{ color: planet.color }}>{planet.astronomy.rotationPeriod}</div>
                      {planet.rotationSpeed < 0 && (
                        <div className="text-sm font-light mt-2 px-3 py-2 rounded" style={{ backgroundColor: `${planet.color}15`, color: planet.color }}>
                          ← RETROGRADE (spins backwards!)
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 font-light">Relative Size</div>
                      <div className="text-lg font-light text-gray-400">{planet.size}% of Earth's diameter</div>
                    </div>
                    {planet.planet.tilt && (
                      <div>
                        <div className="text-xs text-gray-600 font-light">Axial Tilt</div>
                        <div className="text-lg font-light" style={{ color: planet.color }}>98° (rotates on its side!)</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'scientific' && (
            <div className="animate-fade-in space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(planet.astronomy.scientificData).map(([key, value]) => (
                  <div 
                    key={key}
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: `${planet.color}05`, borderColor: `${planet.color}20`, borderWidth: '1px' }}
                  >
                    <div className="text-xs text-gray-600 mb-1 font-light uppercase tracking-wider">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-base sm:text-lg font-light" style={{ color: planet.color }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
       <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}</style>
    </div>
  );
};

export default AstronomyPanel;
