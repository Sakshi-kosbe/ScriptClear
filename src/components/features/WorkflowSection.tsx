import React from 'react';
import { Camera, ShieldAlert, Calendar, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { TabType } from '../../types';

export interface WorkflowSectionProps {
  onNavigateTab: (tab: TabType) => void;
}

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({ onNavigateTab }) => {
  const steps = [
    {
      step: '01',
      title: 'Scan or Ingest Prescription Label',
      description:
        'Point your phone camera or upload a pharmacy bottle label. ScriptClear extracts drug name, dosage, Rx number, and transforms dense fine print into 4th-grade plain language.',
      icon: Camera,
      tab: 'scanner' as TabType,
      cta: 'Try Bottle Scanner',
      accent: 'border-sky-200 bg-sky-50/50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-300',
    },
    {
      step: '02',
      title: 'Real-Time Conflict Sentinel Engine',
      description:
        'Instant multi-drug cross-referencing checks for deadly interactions (like Warfarin + NSAIDs), allergy conflicts (Penicillin/Sulfa), food traps (Grapefruit/Leafy Greens), and prepares doctor questions.',
      icon: ShieldAlert,
      tab: 'conflicts' as TabType,
      cta: 'View Safety Matrix',
      accent: 'border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300',
    },
    {
      step: '03',
      title: 'Visual 24-Hour Routine & Missed Dose Guidance',
      description:
        'Color-coded pill visuals grouped by morning, noon, evening, and bedtime. If a dose is forgotten, the clinical advisor calculates exactly whether to take it now or skip safely.',
      icon: Calendar,
      tab: 'schedule' as TabType,
      cta: 'Open Daily Timeline',
      accent: 'border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300',
    },
  ];

  return (
    <section className="py-12 border-t border-slate-200/80 dark:border-slate-800">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
          How ScriptClear Works
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          From Confusing Pill Bottles to Life-Saving Daily Routine
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Designed specifically to prevent accidental toxic double-dosing and lethal polypharmacy
          clashes among seniors living independently or with family caregivers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, index) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${s.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black text-slate-300 dark:text-slate-700 select-none">
                    {s.step}
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {s.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onNavigateTab(s.tab)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  <span>{s.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
