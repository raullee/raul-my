
import React from 'react';

interface StatusBadgeProps {
  status: 'new' | 'beta' | 'live';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    new: {
      bg: 'rgba(79, 172, 254, 0.25)',
      border: '#4FACFE',
      color: '#4FACFE',
      shadow: 'rgba(79, 172, 254, 0.4)'
    },
    beta: {
      bg: 'rgba(255, 165, 0, 0.25)',
      border: '#FFA500',
      color: '#FFA500',
      shadow: 'rgba(255, 165, 0, 0.4)'
    },
    live: {
      bg: 'rgba(0, 255, 0, 0.2)',
      border: '#00ff88',
      color: '#00ff88',
      shadow: 'rgba(0, 255, 136, 0.4)'
    }
  };

  const style = styles[status];

  return (
    <div 
      className="absolute -top-2 -right-2 z-20 px-2 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase pointer-events-none select-none backdrop-blur-sm animate-pulse-slow"
      style={{
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        color: style.color,
        boxShadow: `0 0 10px ${style.shadow}`,
        animationDuration: '3s'
      }}
    >
      {status}
    </div>
  );
};

export default StatusBadge;
