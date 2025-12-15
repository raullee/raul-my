
import React, { useState, useEffect, useRef } from 'react';
import { Info, Star, Rocket, FileText } from 'lucide-react';

import type { PlanetData } from './types';
import { SOLAR_SYSTEM_DATA, SUN_DATA } from './constants';
import { useAudioContext } from './hooks/useAudioContext';
import { useWindowSize } from './hooks/useWindowSize';

import GalaxyBackground from './components/GalaxyBackground';
import OrbitalRing from './components/OrbitalRing';
import CentralSun from './components/CentralSun';
import Planet from './components/Planet';
import DetailPanel from './components/DetailPanel';
import AstronomyPanel from './components/AstronomyPanel';
import VoyagerTracker from './components/VoyagerTracker';
import SystemCycleTracker from './components/SystemCycleTracker';
import SiteInfoPanel from './components/SiteInfoPanel';
import Comet from './components/Comet';
import SimulationControls from './components/SimulationControls';
import MusicPlayer from './components/MusicPlayer';
import MissionDebrief from './components/MissionDebrief';
import ClickableWrapper from './components/ClickableWrapper';
import SocialTicker from './components/SocialTicker';
import SmartCTA from './components/SmartCTA';
import EasterEggSystem, { TOTAL_EGGS } from './components/EasterEggSystem';
import MarcoPublicist from './components/MarcoPublicist';
import FeaturesPanel from './components/FeaturesPanel';

interface ModalState {
  view: 'detail' | 'astronomy' | null;
  planet: PlanetData | null;
  fromDetail: boolean;
}

// Lightweight Analytics Tracker
const trackInteraction = (category: string, action: string, label?: string) => {
    const event = {
        category, action, label, timestamp: Date.now(), url: window.location.href
    };
    console.debug("Analytics Event:", event);
    // In real deployment: navigator.sendBeacon('/api/track', JSON.stringify(event));
};

const App: React.FC = () => {
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetData | null>(null);
  const [modalState, setModalState] = useState<ModalState>({ view: null, planet: null, fromDetail: false });
  
  // Simulation state
  const [timeScale, setTimeScale] = useState(1);
  const [elapsedSimulationTime, setElapsedSimulationTime] = useState(0);
  
  // Session Stats
  const startTimeRef = useRef(Date.now());
  const [planetsVisited, setPlanetsVisited] = useState<Set<string>>(new Set());
  const [cometsCaught, setCometsCaught] = useState(0);
  const [showMissionDebrief, setShowMissionDebrief] = useState(false);
  const [conjunctionCount, setConjunctionCount] = useState(0);
  
  // Easter Eggs & Onboarding
  const [secretsFound, setSecretsFound] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Parallax State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [orbitAngles, setOrbitAngles] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    SOLAR_SYSTEM_DATA.forEach((planet, index) => {
      initial[planet.id] = (index * 360) / SOLAR_SYSTEM_DATA.length;
    });
    return initial;
  });
  
  const [rotationAngles, setRotationAngles] = useState<Record<string, number>>(() => {
    return Object.fromEntries(SOLAR_SYSTEM_DATA.map(p => [p.id, 0]));
  });

  const [showSiteInfo, setShowSiteInfo] = useState(false);
  const [showMarco, setShowMarco] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const { playTone, soundEnabled, setSoundEnabled } = useAudioContext();
  const { width, height } = useWindowSize();
  
  const animationFrameId = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const totalSimulatedTimeRef = useRef<number>(0);
  const initialOrbitOffsetsRef = useRef<Record<string, number>>({});
  const activeConjunctionsRef = useRef<Set<string>>(new Set());
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  // Konami Code State
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  const [keySequence, setKeySequence] = useState<string[]>([]);

  // Konami Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        setKeySequence(prev => {
            const updated = [...prev, e.key].slice(-10);
            if (JSON.stringify(updated) === JSON.stringify(konamiCode)) {
                // Activate God Mode - 10x Speed
                setTimeScale(10.0);
                playTone(880, 0.5); // High A Success Tone
                
                // Dispatch Konami Discovery
                const discoveryEvent = new CustomEvent('discovery', { detail: { eggId: 'KONAMI_CODE' } });
                window.dispatchEvent(discoveryEvent);

                // Trigger Supernova Visuals
                const supernovaEvent = new CustomEvent('supernova');
                window.dispatchEvent(supernovaEvent);
                
                return [];
            }
            return updated;
        });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playTone]);

  // Deep Linking Handler
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const targetProject = urlParams.get('project');
    
    if (targetProject) {
        const planet = SOLAR_SYSTEM_DATA.find(p => p.id === targetProject);
        if (planet) {
            // Delay slightly to allow simulation to init
            setTimeout(() => {
                setModalState({ view: 'detail', planet, fromDetail: false });
                trackInteraction('Deep Link', 'Open Project', targetProject);
            }, 1000);
        }
    }
    trackInteraction('Navigation', 'Page View');
  }, []);

  // Handle Mouse Move for Parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        setMousePos({
            x: (e.clientX / window.innerWidth - 0.5) * 2,
            y: (e.clientY / window.innerHeight - 0.5) * 2
        });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Onboarding Timeout
  useEffect(() => {
    const timer = setTimeout(() => setShowOnboarding(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  // Exit Intent
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = ''; 
        setShowMissionDebrief(true);
        return '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Audio Initialization
  useEffect(() => {
    const audio = new Audio('/assets/weightless.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    
    const handleError = (e: Event) => {
        console.warn("Audio source failed to load. Music disabled.", e);
        setSoundEnabled(false);
    };
    audio.addEventListener('error', handleError);
    backgroundMusicRef.current = audio;

    const attemptPlay = async () => {
        if (!backgroundMusicRef.current || !soundEnabled) return;
        try { await backgroundMusicRef.current.play(); } 
        catch (error: any) { if (error.name !== 'NotAllowedError') console.debug("Autoplay deferred."); }
    };
    attemptPlay();

    const handleInteraction = async () => {
        if (backgroundMusicRef.current && backgroundMusicRef.current.paused && soundEnabled) {
            try { await backgroundMusicRef.current.play(); removeInteractionListeners(); } catch (e) {}
        }
        // Dismiss onboarding on interaction
        setShowOnboarding(false);
    };

    const removeInteractionListeners = () => {
        window.removeEventListener('click', handleInteraction);
        window.removeEventListener('touchstart', handleInteraction);
        window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
        audio.removeEventListener('error', handleError);
        audio.pause();
        audio.src = '';
        backgroundMusicRef.current = null;
        removeInteractionListeners();
    };
  }, []);

  useEffect(() => {
    const audio = backgroundMusicRef.current;
    if (!audio) return;
    if (soundEnabled) { audio.play().catch(() => {}); } 
    else { audio.pause(); }
  }, [soundEnabled]);

  useEffect(() => {
    const offsets: Record<string, number> = {};
    SOLAR_SYSTEM_DATA.forEach((planet, index) => {
      offsets[planet.id] = (index * 360) / SOLAR_SYSTEM_DATA.length;
    });
    initialOrbitOffsetsRef.current = offsets;
    lastFrameTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastFrameTimeRef.current) / 1000;
      lastFrameTimeRef.current = currentTime;
      totalSimulatedTimeRef.current += deltaTime * timeScale;
      setElapsedSimulationTime(totalSimulatedTimeRef.current);

      const newOrbitAngles: Record<string, number> = {};
      const planetIds = SOLAR_SYSTEM_DATA.map(p => p.id);
      
      SOLAR_SYSTEM_DATA.forEach(planet => {
        newOrbitAngles[planet.id] = (initialOrbitOffsetsRef.current[planet.id] + (totalSimulatedTimeRef.current * 360) / planet.orbitSpeed) % 360;
      });
      setOrbitAngles(newOrbitAngles);
      
      let currentConjunctionCountIncrement = 0;
      for (let i = 0; i < planetIds.length; i++) {
          for (let j = i + 1; j < planetIds.length; j++) {
              const id1 = planetIds[i];
              const id2 = planetIds[j];
              const angle1 = newOrbitAngles[id1];
              const angle2 = newOrbitAngles[id2];
              const diff = Math.abs(angle1 - angle2);
              const shortestDiff = Math.min(diff, 360 - diff);
              const pairKey = `${id1}-${id2}`;
              const ALIGNMENT_THRESHOLD = 1.5; 
              
              if (shortestDiff < ALIGNMENT_THRESHOLD) {
                  if (!activeConjunctionsRef.current.has(pairKey)) {
                      activeConjunctionsRef.current.add(pairKey);
                      currentConjunctionCountIncrement++;
                  }
              } else {
                  activeConjunctionsRef.current.delete(pairKey);
              }
          }
      }
      if (currentConjunctionCountIncrement > 0) setConjunctionCount(prev => prev + currentConjunctionCountIncrement);
      
      const newRotationAngles: Record<string, number> = {};
      SOLAR_SYSTEM_DATA.forEach(planet => {
          const rotationDirection = planet.rotationSpeed > 0 ? 1 : -1;
          newRotationAngles[planet.id] = ((totalSimulatedTimeRef.current * 360) / Math.abs(planet.rotationSpeed)) * rotationDirection % 360;
      });
      setRotationAngles(newRotationAngles);

      animationFrameId.current = requestAnimationFrame(animate);
    };
    animationFrameId.current = requestAnimationFrame(animate);
    return () => { if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current); };
  }, [timeScale]);

  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = width < 768 ? width * 0.05 : Math.min(width, height) * 0.035;
  const orbitScale = 1.0; 

  const handlePlanetClick = (planet: PlanetData) => {
    setModalState({ view: 'detail', planet, fromDetail: false });
    setPlanetsVisited(prev => new Set(prev).add(planet.id));
    playTone(planet.frequency, 0.3);
    trackInteraction('Projects', 'Click Planet', planet.id);
  };

  const handleInfoClick = (planet: PlanetData) => {
    setModalState({ view: 'astronomy', planet, fromDetail: false });
    setPlanetsVisited(prev => new Set(prev).add(planet.id));
    trackInteraction('Projects', 'Click Info', planet.id);
  };


  const handleCometCapture = () => {
    setCometsCaught(prev => prev + 1);
  };
  
  const getZIndex = (planetId: string, isActive: boolean) => {
      if (isActive) return 100;
      const angle = orbitAngles[planetId] || 0;
      const rad = (angle * Math.PI) / 180;
      const sin = Math.sin(rad);
      return sin > 0 ? 60 : 40; // Adjusted for hierarchy
  };

  return (
    <>
    <style>{`
        :root {
            --accent-primary: #4FACFE;
            --accent-primary-glow: rgba(79, 172, 254, 0.6);
            --accent-secondary: #FFA500;
        }
        .clickable-element {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            position: relative;
        }
        .clickable-element:hover {
            filter: brightness(1.2) drop-shadow(0 0 10px var(--accent-primary-glow));
            transform: scale(1.05);
            z-index: 999;
        }
        .clickable-element:hover::before {
            content: '';
            position: absolute;
            inset: -8px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(79, 172, 254, 0.1) 0%, transparent 70%);
            animation: pulse-ring 2s ease-in-out infinite;
            pointer-events: none;
        }
        .clickable-element:active {
            transform: scale(0.98);
            filter: brightness(1.3);
        }
        @keyframes pulse-ring {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.1); opacity: 0.6; }
        }
        .tooltip-container { position: relative; }
        .tooltip {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%) translateY(-10px);
            padding: 6px 12px;
            background: rgba(0, 0, 0, 0.9);
            color: var(--accent-primary);
            font-size: 12px;
            border-radius: 4px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease, transform 0.3s ease;
            border: 1px solid rgba(79, 172, 254, 0.3);
            backdrop-filter: blur(4px);
            z-index: 1000;
        }
        .tooltip-container:hover .tooltip {
            opacity: 1;
            transform: translateX(-50%) translateY(-5px);
            transition-delay: 0.5s;
        }
        .primary-element { opacity: 1; z-index: 100; filter: brightness(1.1); }
        .secondary-element { opacity: 0.8; z-index: 50; }
        .ambient-element { opacity: 0.3; z-index: 10; filter: blur(0.5px); }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
    `}</style>

    <div className="relative w-full h-screen bg-black overflow-hidden text-white select-none font-sans">
      <GalaxyBackground />
      <EasterEggSystem onDiscovery={(count) => setSecretsFound(count)} />
      <Comet onCapture={handleCometCapture} />
      
      {/* Secret Discovery Counter */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-opacity duration-500" style={{ opacity: secretsFound > 0 ? 0.8 : 0 }}>
        <div className="bg-black/60 backdrop-blur-md border border-blue-500/30 rounded-full px-4 py-1 flex items-center gap-2 text-xs font-mono text-blue-400">
            <Star size={12} className="text-yellow-500" fill="currentColor" />
            <span>DISCOVERY: {secretsFound}/{TOTAL_EGGS}</span>
        </div>
      </div>

      {/* Onboarding Overlay */}
      {showOnboarding && (
          <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center animate-fade-in pointer-events-none">
              <div className="text-center space-y-6 p-10">
                  <h1 className="text-3xl md:text-5xl font-extralight text-white tracking-[0.25em] uppercase animate-pulse-slow">
                      RAUL LEE BHASKARAN
                  </h1>
                  
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-700 to-transparent mx-auto"></div>

                  <div className="flex flex-col gap-3">
                      <span className="text-xs md:text-sm font-mono text-blue-400 tracking-[0.4em] uppercase">
                          PROJECT DIRECTORY
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 tracking-[0.3em] mt-2 animate-pulse">
                          LAW / SOUND / SYSTEMS
                      </span>
                  </div>
              </div>
          </div>
      )}

      {/* Controls */}
      <SimulationControls timeScale={timeScale} setTimeScale={setTimeScale} />
      <VoyagerTracker />
      
      {/* Main Container with Parallax */}
      <div 
        className="absolute inset-0 transition-transform duration-75 ease-out will-change-transform"
        style={{
            transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`
        }}
      >
          {/* Orbital Rings (Ambient) */}
          <div className="absolute inset-0 z-0">
            {SOLAR_SYSTEM_DATA.map((planet) => (
              <OrbitalRing
                key={`ring-${planet.id}`}
                radius={baseRadius * planet.orbit * orbitScale}
                active={hoveredPlanet?.id === planet.id}
                color={planet.color}
              />
            ))}
          </div>

          <CentralSun onMarcoClick={() => setShowMarco(true)} />

          {/* Planets (Primary) */}
          <div className="absolute inset-0 pointer-events-none">
            {SOLAR_SYSTEM_DATA.map((planet) => (
              <div 
                key={planet.id} 
                className="absolute inset-0 pointer-events-none"
                style={{ zIndex: getZIndex(planet.id, hoveredPlanet?.id === planet.id) }}
              >
                <div className="pointer-events-auto">
                    <Planet
                    planet={planet}
                    orbitAngle={orbitAngles[planet.id] || 0}
                    rotationAngle={rotationAngles[planet.id] || 0}
                    active={hoveredPlanet?.id === planet.id}
                    onClick={() => handlePlanetClick(planet)}
                    onHover={() => {
                        setHoveredPlanet(planet);
                        playTone(planet.frequency, 0.1);
                    }}
                    onLeave={() => setHoveredPlanet(null)}
                    onInfoClick={() => handleInfoClick(planet)}
                    centerX={centerX}
                    centerY={centerY}
                    baseRadius={baseRadius}
                    width={width}
                    orbitScale={orbitScale}
                    />
                </div>
              </div>
            ))}
          </div>
      </div>

      {/* Utility Dock */}
      <div className="fixed bottom-10 left-6 z-40 flex flex-col items-start gap-4 secondary-element">
        <SystemCycleTracker 
            timeScale={timeScale} 
            elapsedTime={elapsedSimulationTime} 
            liveConjunctionCount={conjunctionCount}
        />
        <div className="flex items-center gap-3">
            <ClickableWrapper tooltipText="Site Directory" className="rounded-full">
                <button
                    className="p-4 text-gray-400 hover:text-white transition-all duration-300 rounded-full bg-gray-900/80 border border-blue-500/30 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] backdrop-blur-sm flex items-center gap-2 group"
                    onClick={() => setShowSiteInfo(true)}
                >
                    <Info size={22} className="group-hover:scale-110 transition-transform text-blue-400" />
                </button>
            </ClickableWrapper>
            <ClickableWrapper tooltipText="Site Features" className="rounded-full">
                <button
                    className="p-4 text-gray-400 hover:text-white transition-all duration-300 rounded-full bg-gray-900/80 border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] backdrop-blur-sm flex items-center gap-2 group"
                    onClick={() => setShowFeatures(true)}
                >
                    <FileText size={22} className="group-hover:scale-110 transition-transform text-cyan-400" />
                </button>
            </ClickableWrapper>
            <ClickableWrapper tooltipText={soundEnabled ? "Mute" : "Unmute"} className="rounded-full">
                <MusicPlayer isPlaying={soundEnabled} onToggle={() => setSoundEnabled(!soundEnabled)} />
            </ClickableWrapper>
        </div>
      </div>
      
      <SmartCTA planetsVisited={planetsVisited.size} />
      <SocialTicker />

      {/* Modals */}
      {modalState.view === 'detail' && modalState.planet && (
        <DetailPanel
          planet={modalState.planet}
          onClose={() => setModalState({ ...modalState, view: null, planet: null })}
          onShowInfo={() => setModalState({ ...modalState, view: 'astronomy', fromDetail: true })}
        />
      )}
      {modalState.view === 'astronomy' && modalState.planet && (
        <AstronomyPanel
          planet={modalState.planet}
          onClose={() => setModalState({ ...modalState, view: null, planet: null })}
          showBack={modalState.fromDetail}
          onBack={() => setModalState({ ...modalState, view: 'detail', fromDetail: false })}
          onShowProject={modalState.planet.id === 'sun' ? undefined : () => setModalState({ ...modalState, view: 'detail', fromDetail: false })} 
        />
      )}
      {showSiteInfo && <SiteInfoPanel planets={SOLAR_SYSTEM_DATA} onClose={() => setShowSiteInfo(false)} />}
      {showMissionDebrief && <MissionDebrief startTime={startTimeRef.current} planetsVisited={planetsVisited.size} cometsCaught={cometsCaught} onClose={() => setShowMissionDebrief(false)} />}
      {showMarco && <MarcoPublicist onClose={() => setShowMarco(false)} />}
      {showFeatures && <FeaturesPanel onClose={() => setShowFeatures(false)} />}
    </div>
    </>
  );
};

export default App;
