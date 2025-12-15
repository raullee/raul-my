
import React, { useEffect, useState } from 'react';
import { X, Rocket, Star, Target, Clock, Telescope, Globe } from 'lucide-react';

interface MissionDebriefProps {
  startTime: number;
  planetsVisited: number;
  cometsCaught: number;
  onClose: () => void;
}

const MissionDebrief: React.FC<MissionDebriefProps> = ({ startTime, planetsVisited, cometsCaught, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    duration: '00:00',
    distance: 0,
    rank: 'Cadet'
  });

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);

    const now = Date.now();
    const diffSeconds = Math.floor((now - startTime) / 1000);
    const minutes = Math.floor(diffSeconds / 60).toString().padStart(2, '0');
    const seconds = (diffSeconds % 60).toString().padStart(2, '0');

    // Earth moves ~30km/s. Calculate "Distance Traveled" while viewing the site.
    const distanceTraveled = diffSeconds * 29.78; 

    let rank = 'Space Tourist';
    const score = planetsVisited + (cometsCaught * 2);
    if (score > 2) rank = 'Orbital Explorer';
    if (score > 5) rank = 'Solar Navigator';
    if (score > 10) rank = 'Void Commander';

    setStats({
      duration: `${minutes}:${seconds}`,
      distance: Math.floor(distanceTraveled),
      rank
    });
  }, [startTime, planetsVisited, cometsCaught]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md transition-opacity duration-1000"
         style={{ opacity: isVisible ? 1 : 0 }}>
      
      <div className="relative w-full max-w-md overflow-hidden bg-gray-950 border border-gray-800 rounded-lg shadow-2xl transform transition-all duration-700"
           style={{ 
             transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
             boxShadow: '0 0 50px rgba(59, 130, 246, 0.1)'
           }}>
           
        {/* Decorative Header */}
        <div className="bg-gray-900/50 p-4 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-gray-400">Mission Debrief</span>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-8 space-y-8">
            {/* Rank Display */}
            <div className="text-center space-y-2">
                <div className="inline-block p-3 rounded-full bg-blue-500/10 border border-blue-500/20 mb-2">
                    <Rocket size={24} className="text-blue-400" />
                </div>
                <h2 className="text-2xl font-extralight text-white tracking-wide">UPLINK TERMINATED</h2>
                <div className="font-mono text-sm text-blue-400 uppercase tracking-widest">Rank: {stats.rank}</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/50 p-4 rounded border border-gray-800/50">
                    <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-1">
                        <Clock size={12} /> Duration
                    </div>
                    <div className="text-xl font-light text-white font-mono">{stats.duration}</div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded border border-gray-800/50">
                    <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-1">
                        <Star size={12} /> Surveyed
                    </div>
                    <div className="text-xl font-light text-white font-mono">{planetsVisited} Planets</div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded border border-gray-800/50">
                    <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-1">
                        <Target size={12} /> Anomalies
                    </div>
                    <div className="text-xl font-light text-white font-mono">{cometsCaught} Caught</div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded border border-gray-800/50">
                    <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider mb-1">
                        <Rocket size={12} /> Traveled
                    </div>
                    <div className="text-xl font-light text-white font-mono">{stats.distance.toLocaleString()} km</div>
                </div>
            </div>

            <div className="text-center">
                <p className="text-gray-500 text-xs font-light italic">
                    "Space is for everybody. It's not just for a few people in science or math, or for a select group of astronauts. That's our new frontier out there."
                </p>
            </div>
        </div>

        {/* Minimalist Footer Links */}
        <div className="p-3 border-t border-gray-800 bg-black/50 backdrop-blur-sm flex justify-center gap-6">
            <a href="https://stellarium.org/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-gray-600 hover:text-gray-400 flex items-center gap-1.5 transition-colors">
                <Telescope size={10} /> STELLARIUM
            </a>
            <a href="https://celestia.space/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-gray-600 hover:text-gray-400 flex items-center gap-1.5 transition-colors">
                <Globe size={10} /> CELESTIA
            </a>
        </div>
      </div>
    </div>
  );
};

export default MissionDebrief;
