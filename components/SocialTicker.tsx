
import React, { useState, useEffect } from 'react';
import { ACHIEVEMENTS } from '../constants';

const SocialTicker: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ACHIEVEMENTS.length);
        setOpacity(1);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-2 left-0 right-0 z-30 pointer-events-none flex justify-center items-center">
      <div 
        className="text-[10px] md:text-xs font-mono text-gray-500/70 transition-opacity duration-500 tracking-widest uppercase"
        style={{ opacity }}
      >
        {ACHIEVEMENTS[index]}
      </div>
    </div>
  );
};

export default SocialTicker;
