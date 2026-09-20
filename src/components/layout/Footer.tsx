import React from 'react';
import { Pill, ShieldCheck, Heart, ExternalLink, CreditCard, Sparkles, Award } from 'lucide-react';
import { TabType } from '../../types';
import { NAV_ITEMS } from '../../constants/navigation';

export interface FooterProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenEmergencyCard: () => void;
  onOpenJudgeModal: () => void;
  onResetDemo: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateTab,
  onOpenEmergencyCard,
  onOpenJudgeModal,
  onResetDemo,
}) => {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md">
                <Pill className="w-5 h-5 rotate-45" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Script<span className="text-sky-600">Clear</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300">
                v2.0 Production
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              Transforming complex multi-prescription schedules into plain-language daily routines,
              preventing adverse geriatric drug interactions, and empowering elderly patients and caregivers.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                AGS Beers Criteria Aligned
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 text-xs font-semibold border border-sky-200 dark:border-sky-800/40">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                Senior High-Contrast Ready
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Core Sentinel Modules
            </h4>
            <ul className="space-y-2 text-sm">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onNavigateTab(item.id)}
                      className="flex items-center gap-2 hover:text-sky-600 dark:hover:text-sky-400 transition cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 3: Safety & Emergency Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Emergency & Clinician Tools
            </h4>
            <div className="space-y-2">
              <button
                onClick={onOpenEmergencyCard}
                className="w-full text-left flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition cursor-pointer text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-rose-500" />
                  Print EMS Wallet Card
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>

              <button
                onClick={onOpenJudgeModal}
                className="w-full text-left flex items-center justify-between p-2.5 rounded-xl bg-amber-50/80 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800/40 transition cursor-pointer text-xs font-bold text-amber-900 dark:text-amber-200"
              >
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  Judging Guide & Scenarios
                </span>
                <Sparkles className="w-3 h-3 text-amber-600" />
              </button>

              <button
                onClick={onResetDemo}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline pt-1 cursor-pointer block"
              >
                Reset Eleanor Vance demo dataset
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar / Medical Disclaimer */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>
            © {new Date().getFullYear()} ScriptClear Health. Built with React, Vite & Tailwind CSS for safe medication adherence.
          </p>
          <p className="max-w-xl text-center sm:text-right text-[11px] leading-tight">
            <strong>Clinical Notice:</strong> ScriptClear is an informational medication literacy aid. Always verify all dosing schedules and potential interactions with a licensed pharmacist or physician.
          </p>
        </div>
      </div>
    </footer>
  );
};
