import React from 'react';

const GlassCard = ({ children, className = '', interactive = false, ...props }) => {
  return (
    <div 
      className={`glass-panel ${interactive ? 'glass-panel-interactive' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
