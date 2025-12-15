import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

interface FeaturesPanelProps {
  onClose: () => void;
}

const FeaturesPanel: React.FC<FeaturesPanelProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const features = [
    {
      title: "Time Control",
      description: "Full control over the speed of the solar system. Pause time completely or speed it up to 5x to watch the planets orbit faster, with smooth acceleration."
    },
    {
      title: "Live Space Data",
      description: "Real-time stats from the actual universe. This includes exactly how far the Voyager 1 probe is from Earth right now and a live count of how many humans are currently in space."
    },
    {
      title: "Planetary Alignments",
      description: "The system automatically watches for \"conjunctions\" - moments when planets pass each other or line up - and counts them as they happen in real-time."
    },
    {
      title: "True-to-Life Physics",
      description: "Every planet moves correctly. For example, you'll see Venus spinning backward and Uranus rolling on its side, just like they do in reality."
    },
    {
      title: "Simulated 3D Depth",
      description: "Even though it's on a screen, planets realistically pass behind the sun and pop out in front of it, creating a sense of deep space."
    },
    {
      title: "Interactive Comets",
      description: "Rare comets (like Halley or Hale-Bopp) will occasionally fly through the system. They have different visual styles (ice, fire, etc.), and you can click to \"capture\" them."
    },
    {
      title: "Focus Audio",
      description: "The experience includes a built-in audio player featuring \"Weightless\" by Marconi Union - a track scientifically proven to reduce anxiety - synced to a visualizer."
    }
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.98)' }}
      onClick={onClose}
    >
      <div
        className={`relative bg-black/40 border border-blue-800 rounded-xl shadow-2xl transition-all duration-500 max-h-[90vh] max-w-4xl w-full flex flex-col backdrop-blur-sm ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 flex-shrink-0 border-b border-blue-800/50 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-blue-400" size={28} />
              <h2 className="text-2xl md:text-3xl font-extralight text-blue-300 tracking-tight">Site Features</h2>
            </div>
            <p className="text-gray-400 font-light mt-1 text-sm md:text-base">Interactive capabilities of this solar system experience</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10 p-2 hover:bg-white/10 rounded-full"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-grow">
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-r from-blue-950/20 to-purple-950/20 border border-blue-800/30 rounded-lg p-5 hover:border-blue-600/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-mono text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2 uppercase tracking-wider">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 font-light leading-relaxed text-sm md:text-base">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-blue-800/50 bg-black/90 rounded-b-xl flex-shrink-0 backdrop-blur-md">
          <p className="text-center text-xs text-gray-500 font-mono">
            raul.my // Interactive Solar System Portfolio
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPanel;
