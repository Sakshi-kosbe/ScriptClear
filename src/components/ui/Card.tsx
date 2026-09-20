import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'interactive' | 'alert' | 'success';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-slate-200/80 shadow-xs dark:bg-slate-900 dark:border-slate-800',
    glass: 'bg-white/80 backdrop-blur-md border border-white/40 shadow-sm dark:bg-slate-900/80 dark:border-slate-800/50',
    interactive:
      'bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 dark:bg-slate-900 dark:border-slate-800',
    alert: 'bg-rose-50/70 border border-rose-200 shadow-xs dark:bg-rose-950/20 dark:border-rose-800/40',
    success: 'bg-emerald-50/70 border border-emerald-200 shadow-xs dark:bg-emerald-950/20 dark:border-emerald-800/40',
  };

  return (
    <div
      className={cn(
        'rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
