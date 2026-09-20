import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Calendar,
  Camera,
  Heart,
  Sparkles,
  ArrowRight,
  Clock,
  Pill,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { TabType, Medication, DoseLog } from '../../types';
import { ConflictAnalysisResult } from '../../utils/conflictChecker';
import { MedicationService } from '../../services/medicationService';

export interface HeroSectionProps {
  medications: Medication[];
  doseLogs: DoseLog[];
  safetyResult: ConflictAnalysisResult;
  seniorMode: boolean;
  onNavigateTab: (tab: TabType) => void;
  onOpenJudgeModal: () => void;
  onQuickSimulateConflict: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  medications,
  doseLogs,
  safetyResult,
  seniorMode,
  onNavigateTab,
  onOpenJudgeModal,
  onQuickSimulateConflict,
}) => {
  const adherencePercent = MedicationService.calculateAdherence(medications, doseLogs);
  const totalConflicts = safetyResult.conflicts.length;
  const totalAllergies = safetyResult.allergyAlerts.length;
  const isDanger = totalConflicts > 0 || totalAllergies > 0;

  return (
    <section className="relative overflow-hidden pt-4 pb-8">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-sky-100/60 rounded-full blur-3xl opacity-70 pointer-events-none dark:bg-sky-950/20" />
      <div className="absolute bottom-0 left-1/3 -z-10 w-80 h-80 bg-teal-100/50 rounded-full blur-3xl opacity-60 pointer-events-none dark:bg-teal-950/20" />

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Left Column: Headline & Value Prop */}
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>AI-Assisted Geriatric Medication Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Prescription clarity for seniors,{' '}
            <span className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-transparent">
              zero confusing fine print.
            </span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Over 40% of older adults take 5+ prescriptions simultaneously. ScriptClear translates
            clinical jargon into simple instructions, checks for lethal drug-drug clashes in real time,
            and schedules meals and pills visually.
          </p>

          {/* Quick Action CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('scanner')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-sm shadow-md shadow-sky-600/25 transition cursor-pointer active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Prescription Bottle</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onQuickSimulateConflict}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-sm transition cursor-pointer"
              title="Simulate adding over-the-counter Ibuprofen to trigger Warfarin conflict"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Test Sentinel Hazard</span>
            </button>

            <button
              onClick={onOpenJudgeModal}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xs transition cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Evaluation Guide</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Telemetry Metric Bento */}
        <div className="w-full lg:w-96 flex-shrink-0 grid grid-cols-2 gap-3.5">
          {/* Card 1: Active Meds */}
          <div
            onClick={() => onNavigateTab('cabinet')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Regimen</span>
              <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
                <Pill className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {medications.length} <span className="text-xs font-semibold text-slate-500">Rx</span>
            </div>
            <div className="text-[11px] text-sky-600 dark:text-sky-400 font-bold mt-1 group-hover:underline flex items-center gap-1">
              View Cabinet &rarr;
            </div>
          </div>

          {/* Card 2: Today's Adherence */}
          <div
            onClick={() => onNavigateTab('schedule')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Today's Doses</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {adherencePercent}%
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 group-hover:underline flex items-center gap-1">
              Daily Timeline &rarr;
            </div>
          </div>

          {/* Card 3: Safety Sentinel Status */}
          <div
            onClick={() => onNavigateTab('conflicts')}
            className={`col-span-2 p-4 rounded-2xl border transition cursor-pointer group ${
              isDanger
                ? 'bg-rose-50/80 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800 text-rose-950 dark:text-rose-100 ring-2 ring-rose-400/30'
                : 'bg-emerald-50/80 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {isDanger ? (
                  <ShieldAlert className="w-5 h-5 text-rose-600 animate-pulse" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                )}
                <span className="text-xs font-black uppercase tracking-wider">
                  {isDanger ? 'Critical Warning Active' : 'Sentinel: No Lethal Clashes'}
                </span>
              </div>
              <span className="text-xs font-bold underline">Investigate</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {isDanger
                ? `${totalConflicts} drug clash and ${totalAllergies} allergy alert detected in Eleanor's cabinet.`
                : 'All 4 baseline medications verified compatible with zero known fatal contraindications.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
