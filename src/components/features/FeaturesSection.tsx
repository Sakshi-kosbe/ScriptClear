import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Eye,
  CreditCard,
  HelpCircle,
  Pill,
  Volume2,
  FileCheck2,
} from 'lucide-react';
import { TabType } from '../../types';

export interface FeaturesSectionProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenEmergencyCard: () => void;
  seniorMode: boolean;
  setSeniorMode: (val: boolean) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  onNavigateTab,
  onOpenEmergencyCard,
  seniorMode,
  setSeniorMode,
}) => {
  const features = [
    {
      title: '4th-Grade Plain Language Conversion',
      description:
        'Converts confusing clinical directives like "take q.d. with meals" into simple instructions: "Take 1 pill every morning with breakfast to lower your blood pressure."',
      icon: FileCheck2,
      badge: 'FDA Health Literacy',
      action: () => onNavigateTab('cabinet'),
      actionLabel: 'Inspect Plain Directions',
    },
    {
      title: 'Real-Time Drug Conflict Sentinel',
      description:
        'Continuous surveillance flags severe risks like internal bleeding from Warfarin + NSAIDs, hyperkalemia from ACE inhibitors, and dangerous food clashes with Grapefruit or Leafy Greens.',
      icon: ShieldCheck,
      badge: 'Patient Safety',
      action: () => onNavigateTab('conflicts'),
      actionLabel: 'Check Active Sentinel',
    },
    {
      title: 'Visual Pill Identifier System',
      description:
        'Eliminates confusion between multiple white tablets by rendering authentic pill shapes (capsule, diamond, oval, round) and custom colors alongside instructions.',
      icon: Pill,
      badge: 'Visual Precision',
      action: () => onNavigateTab('schedule'),
      actionLabel: 'View Pill Shapes',
    },
    {
      title: 'Pharmacist-Grade Missed Dose Advisor',
      description:
        'Interactive hours-late slider gives immediate safety advice: take immediately with water, adjust meal timing, or skip safely to prevent toxic accumulation.',
      icon: HelpCircle,
      badge: 'Never Double Dose',
      action: () => onNavigateTab('missed'),
      actionLabel: 'Calculate Missed Dose',
    },
    {
      title: 'Standardized EMS Emergency Wallet Card',
      description:
        'One-click formatted printout for paramedics and ER triage nurses detailing blood type, active medications, known allergies, and primary physician contacts.',
      icon: CreditCard,
      badge: 'Life-Saving Triage',
      action: onOpenEmergencyCard,
      actionLabel: 'Preview Wallet Card',
    },
    {
      title: 'Senior High-Contrast & Voice Readouts',
      description:
        'Built specifically for elderly eyes and arthritic hands with large touch targets, high-contrast amber/slate themes, and native Web Speech API readouts.',
      icon: Volume2,
      badge: 'WCAG AAA Contrast',
      action: () => setSeniorMode(!seniorMode),
      actionLabel: seniorMode ? 'Disable High Contrast' : 'Enable High Contrast',
    },
  ];

  return (
    <section className="py-12 border-t border-slate-200/80 dark:border-slate-800">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Comprehensive Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Engineered for Polypharmacy Peace of Mind
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
          Combining clinical pharmacology databases with accessible human-centered design for seniors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {f.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={f.action}
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                >
                  <span>{f.actionLabel}</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
