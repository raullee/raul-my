
import React, { useState, useEffect } from 'react';

interface ElectricBorderProps {
  children: React.ReactNode;
  color: string;
  active: boolean;
  className?: string;
}

const ElectricBorder: React.FC<ElectricBorderProps> = ({ children, color, active, className }) => {
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    if (!active) return;

    let animationFrameId: number;
    const animate = () => {
      setAngle(prev => (prev + 2) % 360);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [active]);

  return (
    <div className={`relative ${className || ''}`}>
      <div
        className="absolute inset-0 rounded-full transition-opacity duration-300 pointer-events-none"
        style={{
          background: `
            linear-gradient(black, black) padding-box,
            conic-gradient(
              from ${angle}deg,
              transparent 0deg,
              ${color} 60deg,
              transparent 120deg,
              ${color} 180deg,
              transparent 240deg,
              ${color} 300deg,
              transparent 360deg
            ) border-box
          `,
          border: '3px solid transparent',
          opacity: active ? 1 : 0
        }}
      />
      {children}
    </div>
  );
};

export default ElectricBorder;
