import React from 'react';
import { Files, AlertTriangle, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { AnalyzedDocument, Medication } from '../../types';
import { ConflictAnalysisResult } from '../../utils/conflictChecker';

export interface StatsOverviewProps {
  documents: AnalyzedDocument[];
  medications: Medication[];
  safetyResult: ConflictAnalysisResult;
  adherencePercentage: number;
  onNavigate: (view: 'documents' | 'sentinel' | 'routine' | 'cabinet') => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  documents,
  medications,
  safetyResult,
  adherencePercentage,
  onNavigate,
}) => {
  const hazardsCount = documents.filter((d) => d.status === 'flagged_hazard').length;
  const conflictsCount = safetyResult.conflicts.length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Stat 1: Documents Analyzed */}
      <div
        onClick={() => onNavigate('documents')}
        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-sky-300 dark:hover:border-sky-800 transition cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Documents Analyzed
          </span>
          <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center">
            <Files className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {documents.length}
        </div>
        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          <span className="text-emerald-600 font-bold">100% processed</span>
          <span>• Clinical grade</span>
        </div>
      </div>

      {/* Stat 2: Issues / Hazards Found */}
      <div
        onClick={() => onNavigate('sentinel')}
        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-rose-300 dark:hover:border-rose-800 transition cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Potential Issues Found
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {hazardsCount + conflictsCount}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {hazardsCount > 0 ? (
            <span className="text-rose-600 font-bold">
              {hazardsCount} document {hazardsCount === 1 ? 'hazard' : 'hazards'} intercepted
            </span>
          ) : (
            <span className="text-emerald-600 font-medium">All active scripts safe</span>
          )}
        </div>
      </div>

      {/* Stat 3: Active Regimen */}
      <div
        onClick={() => onNavigate('cabinet')}
        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Active Prescriptions
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {medications.length}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Eleanor Vance's daily cabinet
        </div>
      </div>

      {/* Stat 4: Adherence Rate */}
      <div
        onClick={() => onNavigate('routine')}
        className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Today's Adherence
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {adherencePercentage}%
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Logged across 4 time windows
        </div>
      </div>
    </div>
  );
};
