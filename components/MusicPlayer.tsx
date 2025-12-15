
import React from 'react';
import { VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  isPlaying: boolean;
  onToggle: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isPlaying, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={`relative p-3 rounded-full backdrop-blur-sm border transition-all duration-300 group flex items-center gap-2 overflow-hidden ${
        isPlaying 
          ? 'bg-gray-900/50 border-gray-700 hover:border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
          : 'bg-gray-900/50 border-gray-700 hover:border-gray-500 text-gray-500 hover:text-gray-300'
      }`}
      title={isPlaying ? "Mute Audio" : "Enable Audio"}
    >
      <div className="relative z-10 flex items-center justify-center w-5 h-5">
        {isPlaying ? (
          <div className="flex items-end justify-center gap-[3px] h-3 w-5 pb-[1px]">
            <div className="w-0.5 bg-blue-400 animate-music-bar-1 h-full origin-bottom rounded-t-full"></div>
            <div className="w-0.5 bg-blue-400 animate-music-bar-2 h-full origin-bottom rounded-t-full"></div>
            <div className="w-0.5 bg-blue-400 animate-music-bar-3 h-full origin-bottom rounded-t-full"></div>
            <div className="w-0.5 bg-blue-400 animate-music-bar-4 h-full origin-bottom rounded-t-full"></div>
          </div>
        ) : (
          <VolumeX size={18} />
        )}
      </div>
      
      <span className={`text-xs font-mono uppercase tracking-wider overflow-hidden whitespace-nowrap transition-all duration-300 w-0 group-hover:w-auto group-hover:opacity-100 opacity-0 ${isPlaying ? 'ml-0 group-hover:ml-2' : ''}`}>
        {isPlaying ? 'Sound On' : 'Muted'}
      </span>

      <style>{`
        @keyframes music-bar {
          0%, 100% { height: 20%; opacity: 0.5; }
          50% { height: 100%; opacity: 1; }
        }
        .animate-music-bar-1 { animation: music-bar 1s ease-in-out infinite; }
        .animate-music-bar-2 { animation: music-bar 0.8s ease-in-out 0.1s infinite; }
        .animate-music-bar-3 { animation: music-bar 1.2s ease-in-out 0.2s infinite; }
        .animate-music-bar-4 { animation: music-bar 0.9s ease-in-out 0.3s infinite; }
      `}</style>
    </button>
  );
};

export default MusicPlayer;
