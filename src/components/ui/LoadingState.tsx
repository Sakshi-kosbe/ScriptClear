import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface LoadingStateProps {
  title?: string;
  subtitle?: string;
  steps?: string[];
  currentStepIndex?: number;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Analyzing Document...',
  subtitle = 'ScriptClear is reading and cross-referencing your medical text.',
  steps = [
    'Parsing document structure & optical recognition',
    'Extracting active compounds, dosages, and directions',
    'Cross-referencing active medications for polypharmacy interactions',
    'Synthesizing 4th-grade plain language action plan',
  ],
  currentStepIndex = 0,
  className,
}) => {
  const [internalStep, setInternalStep] = useState(currentStepIndex);

  useEffect(() => {
    const timer = setInterval(() => {
      setInternalStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 700);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div
      className={cn(
        'p-8 sm:p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center max-w-lg mx-auto shadow-xs space-y-6',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 mx-auto flex items-center justify-center border border-sky-100 dark:border-sky-900">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Progress Steps Checklist */}
      <div className="text-left space-y-3 pt-2 max-w-sm mx-auto border-t border-slate-100 dark:border-slate-800">
        {steps.map((step, idx) => {
          const isDone = idx < internalStep;
          const isCurrent = idx === internalStep;
          return (
            <div key={step} className="flex items-center gap-3 text-xs">
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-sky-600 animate-spin flex-shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-300 dark:text-slate-700 flex-shrink-0" />
              )}
              <span
                className={cn(
                  isDone && 'text-slate-700 dark:text-slate-300 font-medium',
                  isCurrent && 'text-sky-700 dark:text-sky-300 font-bold',
                  !isDone && !isCurrent && 'text-slate-400 dark:text-slate-600'
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
