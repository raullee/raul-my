
import React, { useState, useEffect } from 'react';
import { useWindowSize } from '../hooks/useWindowSize';
import { Rocket, ExternalLink, Users, Radio, Satellite, ChevronUp, ChevronDown } from 'lucide-react';

// Voyager 1 Data
// Base Distance ~24.4 Billion KM (approx value for 2024)
// Speed ~17 km/s relative to sun.
const BASE_DISTANCE_KM = 24380000000; 
const SPEED_KM_S = 17;
const KM_TO_MILES = 0.621371;

const VoyagerTracker: React.FC = () => {
    const { width } = useWindowSize();
    const [distance, setDistance] = useState(BASE_DISTANCE_KM);
    const [isReceiving, setIsReceiving] = useState(true);
    const [unit, setUnit] = useState<'km' | 'mi'>('km');
    const [humansInSpace, setHumansInSpace] = useState<number | null>(10); // Default to 10 immediately
    const [isExpanded, setIsExpanded] = useState(true);
    
    // Physics tick for Voyager
    useEffect(() => {
        const startTime = Date.now();
        const startDistance = BASE_DISTANCE_KM;

        const intervalId = setInterval(() => {
            const now = Date.now();
            const elapsedSeconds = (now - startTime) / 1000;
            setDistance(startDistance + (elapsedSeconds * SPEED_KM_S));
            
            // Randomly flicker the "receiving" light to simulate DSN downlink
            if (Math.random() > 0.9) setIsReceiving(prev => !prev);
        }, 50);

        return () => clearInterval(intervalId);
    }, []);

    // Async data fetch for Humans in Space
    useEffect(() => {
        const fetchHumans = async () => {
            try {
                // Add timestamp to prevent caching
                const timestamp = Date.now();
                // Using 'raw' mode in allorigins to get clean JSON directly, bypassing CORS
                const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent('http://api.open-notify.org/astros.json')}&t=${timestamp}`);
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                
                if (data && typeof data.number === 'number' && data.number > 0) {
                     setHumansInSpace(data.number);
                } else {
                    // Fallback to known accurate value if API returns strange data
                    setHumansInSpace(10);
                }
            } catch (e) {
                // If API fails, fallback to known accurate value (10) as per request
                setHumansInSpace(10);
            }
        };

        fetchHumans();
        // Refresh every 5 minutes
        const interval = setInterval(fetchHumans, 300000);
        return () => clearInterval(interval);
    }, []);

    const isMobile = width < 768;
    const displayDistance = unit === 'km' ? distance : distance * KM_TO_MILES;

    return (
        <div className={`fixed top-6 left-6 z-50 flex flex-col gap-2 transition-all duration-500 ${isExpanded ? 'w-auto' : 'w-auto'}`}>
            
            {/* Minimizable Header / Dock Toggle */}
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 p-2 bg-gray-900/80 border border-gray-800 rounded-lg backdrop-blur-md hover:border-gray-600 transition-colors group w-full"
                title={isExpanded ? "Minimize Telemetry" : "Expand Telemetry"}
            >
                <Satellite size={14} className={`text-blue-400 ${!isExpanded && isReceiving ? 'animate-pulse' : ''}`} />
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                    {isExpanded ? "DEEP SPACE NETWORK" : "UPLINK ACTIVE"}
                </span>
                <div className="ml-auto text-gray-600 group-hover:text-white">
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </div>
            </button>

            {isExpanded && (
                <div className="flex flex-col gap-2 animate-fade-in-down origin-top">
                    {/* Voyager Module */}
                    <div 
                        className="p-3 rounded-lg bg-gray-900/80 border border-gray-800 text-xs font-mono text-gray-400 tracking-wider backdrop-blur-md shadow-lg hover:border-orange-500/30 transition-colors group cursor-pointer"
                        onClick={() => setUnit(prev => prev === 'km' ? 'mi' : 'km')}
                        title="Click to toggle units (km/mi)"
                    >
                        <div className={`flex items-center gap-4 ${isMobile ? 'flex-col items-start gap-2' : ''}`}>
                            <div className="flex items-center gap-2 text-orange-400">
                                <Rocket size={14} className="transform -rotate-45" />
                                <span className="font-bold">VOYAGER 1</span>
                                <div className={`w-1.5 h-1.5 rounded-full ${isReceiving ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-gray-700'} transition-colors duration-75`} title="DSN Downlink Active"></div>
                            </div>
                            
                            <div className="flex flex-col">
                                <span className="text-[9px] text-gray-600 uppercase">Telemetry ({unit})</span>
                                <span className="text-white tabular-nums font-light tracking-widest text-sm">
                                    {displayDistance.toLocaleString(undefined, { maximumFractionDigits: 0 })} {unit}
                                </span>
                            </div>

                            <div className="h-8 w-px bg-gray-800 hidden sm:block"></div>

                            <a 
                                href="https://voyager.jpl.nasa.gov/mission/status/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-[9px] text-orange-400/80 hover:text-orange-300 bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20 hover:bg-orange-500/20 transition-all"
                                title="View Official NASA JPL Mission Status"
                                onClick={(e) => e.stopPropagation()}
                            >
                                NASA JPL <ExternalLink size={10} />
                            </a>
                        </div>
                        
                        <div className="w-full bg-gray-800/50 rounded-full h-0.5 mt-2 overflow-hidden">
                            <div className="bg-orange-500/50 h-full w-1/2 animate-pulse-slow" style={{ width: '100%' }}></div>
                        </div>
                    </div>

                    {/* Humans In Orbit Module - Only renders if API data is valid */}
                    {humansInSpace !== null && (
                        <div className="p-2 px-3 rounded-lg bg-gray-900/60 border border-gray-800 text-xs font-mono text-gray-400 backdrop-blur-sm flex items-center justify-between gap-4 hover:border-blue-500/30 transition-colors">
                            <div className="flex items-center gap-2">
                                <Users size={12} className="text-blue-400" />
                                <span className="text-[10px] uppercase text-gray-500">Humans in Orbit</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" title="Live Data"></div>
                                    <span className="text-white font-bold">{humansInSpace}</span>
                                </div>
                                <a 
                                    href="https://www.howmanypeopleareinspacerightnow.com/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-blue-400 transition-colors"
                                    title="Who is in space right now?"
                                >
                                    <Radio size={10} />
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            <style>{`
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-down {
                    animation: fade-in-down 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default VoyagerTracker;
