import React, { useState, useEffect } from 'react';
import { X, Sparkles, Mic, MicOff } from 'lucide-react';
import { useGeminiLive } from '../hooks/useGeminiLive';
import { ConnectionState } from '../types';

interface MarcoPublicistProps {
  onClose: () => void;
}

const MarcoPublicist: React.FC<MarcoPublicistProps> = ({ onClose }) => {
  const { connectionState, error, volume, connect, disconnect } = useGeminiLive();
  const [isVisible, setIsVisible] = useState(false);

  const isConnected = connectionState === ConnectionState.CONNECTED;
  const isConnecting = connectionState === ConnectionState.CONNECTING;
  const isError = connectionState === ConnectionState.ERROR;

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleToggleConnection = () => {
    if (isConnected || isConnecting) {
      disconnect();
    } else {
      connect();
    }
  };

  // Visualizer component
  const Visualizer = () => {
    const bars = 40;
    const inputLevel = volume.inputVolume;
    const outputLevel = volume.outputVolume;

    return (
      <div className="flex items-center justify-center gap-1 h-32 px-4">
        {Array.from({ length: bars }).map((_, i) => {
          const normalizedIndex = i / bars;
          const centerDistance = Math.abs(normalizedIndex - 0.5) * 2;
          const baseHeight = isConnected ? 0.2 : 0.1;

          // Left half responds to input, right half to output
          const level = normalizedIndex < 0.5 ? inputLevel : outputLevel;
          const height = baseHeight + level * (1 - centerDistance) * 0.8;

          return (
            <div
              key={i}
              className="flex-1 rounded-full transition-all duration-100"
              style={{
                height: `${height * 100}%`,
                background: `linear-gradient(to top,
                  ${normalizedIndex < 0.5 ? '#a855f7' : '#ec4899'},
                  ${normalizedIndex < 0.5 ? '#d946ef' : '#f472b6'}
                )`,
                opacity: isConnected ? 0.9 : 0.3,
                boxShadow: isConnected && height > 0.3
                  ? `0 0 10px ${normalizedIndex < 0.5 ? '#a855f7' : '#ec4899'}`
                  : 'none',
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={onClose}
    >
      <div
        className={`relative bg-gradient-to-br from-purple-950/90 via-black/95 to-pink-950/90 border-2 border-purple-500/50 rounded-2xl shadow-2xl transition-all duration-500 max-w-2xl w-full backdrop-blur-xl ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 0 60px rgba(168, 85, 247, 0.4), 0 0 100px rgba(236, 72, 153, 0.2)',
        }}
      >
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 animate-pulse-slow" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-300 hover:text-white transition-colors z-10 p-2 hover:bg-white/10 rounded-full"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="relative p-8 pb-4 text-center border-b border-purple-500/30">
          <div className="flex items-center justify-center mb-3">
            <Sparkles className="text-pink-400 mr-3 animate-pulse" size={32} />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Marco
            </h2>
            <Sparkles className="text-purple-400 ml-3 animate-pulse" size={32} />
          </div>
          <p className="text-purple-300 text-lg font-light italic">
            Raul's AI Publicist
          </p>
          <p className="text-purple-400/70 text-sm mt-2">
            Here to discuss Raul's work ✨
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Status indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className={`flex items-center space-x-3 px-6 py-3 rounded-full border transition-all duration-300 ${
              isConnected
                ? 'bg-green-500/20 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                : isError
                ? 'bg-red-500/20 border-red-500/50'
                : 'bg-purple-500/10 border-purple-500/30'
            }`}>
              <span className={`inline-block w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500 animate-pulse' : isError ? 'bg-red-500' : 'bg-purple-500'
              }`} style={{
                boxShadow: isConnected ? '0 0 10px rgba(34,197,94,0.8)' : 'none'
              }} />
              <span className="text-sm font-mono text-purple-200 uppercase tracking-wider">
                {isConnecting ? 'Preparing Fabulousness...' : isConnected ? 'Marco is LIVE!' : isError ? 'Connection Error' : 'Ready to Chat'}
              </span>
            </div>
          </div>

          {/* Visualizer */}
          <div className="bg-black/40 rounded-xl border border-purple-500/30 mb-6 overflow-hidden backdrop-blur-sm">
            <Visualizer />
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          {/* Instructions */}
          {!isConnected && !isConnecting && (
            <div className="mb-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg text-purple-200 text-sm text-center space-y-2">
              <p className="font-semibold">Ready for a fabulous conversation?</p>
              <p className="text-purple-300/80">Click the button below and allow microphone access to chat with Marco about Raul's incredible work!</p>
            </div>
          )}

          {/* Main action button */}
          <button
            onClick={handleToggleConnection}
            disabled={isConnecting}
            className={`
              w-full group relative px-8 py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 overflow-hidden
              ${isConnected
                ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-[0_0_30px_rgba(220,38,38,0.5)]'
                : 'bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.5)]'}
              ${isConnecting ? 'opacity-70 cursor-wait' : 'hover:scale-105'}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <span className="relative z-10 flex items-center justify-center space-x-3">
              {isConnecting ? (
                <>
                  <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Preparing the Stage...</span>
                </>
              ) : isConnected ? (
                <>
                  <MicOff size={24} />
                  <span>End Conversation</span>
                </>
              ) : (
                <>
                  <Mic size={24} />
                  <span>Talk to Marco</span>
                </>
              )}
            </span>

            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>

          {/* Powered by */}
          <div className="mt-4 text-center text-xs text-purple-400/60 font-mono">
            Powered by Gemini Live API ✨ Voice: Puck
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarcoPublicist;
