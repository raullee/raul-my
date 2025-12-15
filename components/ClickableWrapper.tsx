import React from 'react';

interface ClickableWrapperProps {
  children: React.ReactNode;
  tooltipText: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

const ClickableWrapper: React.FC<ClickableWrapperProps> = ({ 
  children, 
  tooltipText, 
  onClick, 
  className = '' 
}) => {
  return (
    <div 
      className={`clickable-element tooltip-container ${className}`} 
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={tooltipText}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick && onClick(e as any);
        }
      }}
    >
      {children}
      <div className="tooltip font-mono tracking-wide">
        {tooltipText}
      </div>
    </div>
  );
};

export default ClickableWrapper;