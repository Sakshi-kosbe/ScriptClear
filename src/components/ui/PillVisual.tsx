import React from 'react';
import { Medication } from '../../types';
import { cn } from '../../utils/cn';

export interface PillVisualProps {
  medication: Medication;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PillVisual: React.FC<PillVisualProps> = ({
  medication,
  size = 'md',
  className,
}) => {
  const { shape, form, color, brandName } = medication;

  const dimStyles = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16',
  };

  const pillColor = color || '#cbd5e1';

  return (
    <div
      className={cn(
        dimStyles[size],
        'rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-inner flex-shrink-0 relative transition-transform hover:scale-105',
        className
      )}
      title={`${brandName} (${shape} ${form}, ${color})`}
      aria-label={`Visual depiction of ${brandName}, ${color} ${shape} ${form}`}
    >
      {form === 'capsule' ? (
        <div
          className="w-4/5 h-1/2 rounded-full border border-slate-400/40 shadow-xs flex overflow-hidden transform -rotate-45"
          style={{ backgroundColor: pillColor }}
        >
          <div className="w-1/2 h-full bg-white/70 border-r border-slate-300" />
          <div className="w-1/2 h-full" />
        </div>
      ) : shape === 'oval' ? (
        <div
          className="w-4/5 h-2/5 rounded-full border border-slate-400/50 shadow-xs relative flex items-center justify-center transform -rotate-12"
          style={{ backgroundColor: pillColor }}
        >
          <div className="w-px h-full bg-black/20" />
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
          <div className="w-full h-px bg-black/20" />
        </div>
      )}
    </div>
  );
};
