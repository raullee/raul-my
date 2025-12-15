import React from 'react';

interface OrbitalRingProps {
  radius: number;
  active: boolean;
  color: string;
}

const OrbitalRing: React.FC<OrbitalRingProps> = ({ radius, active, color }) => {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none ambient-element"
      style={{
        width: radius * 2,
        height: radius * 2,
        borderColor: active ? `${color}40` : 'rgba(100, 180, 255, 0.12)',
        borderWidth: active ? '2px' : '1px',
        boxShadow: active ? `0 0 30px ${color}30, inset 0 0 30px ${color}15` : 'none',
        transition: 'border-color 500ms, border-width 500ms, box-shadow 500ms'
      }}
    />
  );
};

export default OrbitalRing;