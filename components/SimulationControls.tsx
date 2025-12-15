
import React from 'react';
import { Play, Pause, FastForward, Clock } from 'lucide-react';

interface SimulationControlsProps {
  timeScale: number;
  setTimeScale: (scale: number) => void;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({ 
  timeScale, 
  setTimeScale
}) => {
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeScale(parseFloat(e.target.value));
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-3">
      <div className="flex items-center gap-3 bg-gray-900/60 backdrop-blur-md border border-gray-800 rounded-full p-2 px-4 transition-all hover:border-gray-600 shadow-lg">
        
        <button 
            onClick={() => setTimeScale(timeScale === 0 ? 1 : 0)}
            className="text-gray-400 hover:text-white transition-colors"
            title={timeScale === 0 ? "Resume Simulation" : "Pause Simulation"}
        >
            {timeScale === 0 ? <Play size={14} /> : <Pause size={14} />}
        </button>

        <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={timeScale}
            onChange={handleSliderChange}
            className="w-20 md:w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            title={`Simulation Speed: ${timeScale.toFixed(1)}x`}
        />
        
        <div className="flex items-center gap-1 w-6 justify-end">
                {timeScale > 2 ? (
                <FastForward size={14} className="text-purple-400 animate-pulse" />
                ) : (
                <Clock size={14} className={`text-gray-400 ${timeScale > 0 ? 'animate-spin-slow' : ''}`} style={{ animationDuration: '4s' }} />
                )}
        </div>
      </div>
      
      {/* Tooltip indicating speed status - hidden on very small screens to save space */}
      <div className={`text-[10px] font-mono tracking-widest transition-opacity duration-300 hidden md:block ${timeScale !== 1 ? 'opacity-100' : 'opacity-0'}`}>
        <span className={timeScale === 0 ? 'text-red-400' : timeScale > 2 ? 'text-purple-400' : 'text-blue-400'}>
            {timeScale === 0 ? 'SIMULATION PAUSED' : `TIME DILATION: ${timeScale.toFixed(1)}x`}
        </span>
      </div>
      
      <style>{`
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 12px;
            width: 12px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            margin-top: -4px;
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        input[type=range]::-webkit-slider-runnable-track {
            width: 100%;
            height: 4px;
            cursor: pointer;
            background: #374151;
            border-radius: 2px;
        }
      `}</style>
    </div>
  );
};

export default SimulationControls;
