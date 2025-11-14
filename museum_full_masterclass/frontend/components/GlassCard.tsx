
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/20 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
