import React from 'react';
import { Medication } from '../types';

interface PillVisualProps {
  medication: Medication;
  size?: 'sm' | 'md' | 'lg';
}

export const PillVisual: React.FC<PillVisualProps> = ({ medication, size = 'md' }) => {
  const { shape, form, color, brandName } = medication;

  // Dimensions based on size
  const dim = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-14 h-14' : 'w-10 h-10';

  const pillColor = color || '#cbd5e1';

  return (
    <div
      className={`${dim} rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-inner flex-shrink-0 relative`}
      title={`${brandName} (${shape} ${form}, ${color})`}
    >
      {form === 'capsule' ? (
        <div
          className="w-4/5 h-1/2 rounded-full border border-slate-400/40 shadow-xs flex overflow-hidden transform -rotate-45"
          style={{ backgroundColor: pillColor }}
        >
          <div className="w-1/2 h-full bg-white/70 border-r border-slate-300"></div>
          <div className="w-1/2 h-full"></div>
        </div>
      ) : shape === 'oval' ? (
        <div
          className="w-4/5 h-2/5 rounded-full border border-slate-400/50 shadow-xs relative flex items-center justify-center transform -rotate-12"
          style={{ backgroundColor: pillColor }}
        >
          <div className="w-px h-full bg-black/20"></div>
        </div>
      ) : shape === 'diamond' ? (
        <div
          className="w-3/5 h-3/5 border border-slate-400/50 shadow-xs transform rotate-45 rounded-xs"
          style={{ backgroundColor: pillColor }}
        />
      ) : (
        // Standard round tablet
        <div
          className="w-3/5 h-3/5 rounded-full border border-slate-400/50 shadow-xs relative flex items-center justify-center"
          style={{ backgroundColor: pillColor }}
        >
          <div className="w-full h-px bg-black/20"></div>
        </div>
      )}
    </div>
  );
};
