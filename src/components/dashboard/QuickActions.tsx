import React from 'react';
import { UploadCloud, ShieldAlert, Calendar, CreditCard, Sparkles } from 'lucide-react';
import { WorkspaceView } from '../../types';

export interface QuickActionsProps {
  onNavigate: (view: WorkspaceView) => void;
  onOpenEmergencyCard: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onNavigate,
  onOpenEmergencyCard,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          onClick={() => onNavigate('documents')}
          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-800 hover:bg-sky-50/20 transition text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center flex-shrink-0">
            <UploadCloud className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600">
              Upload Document
            </div>
            <div className="text-[10px] text-slate-500">PDF, DOCX, TXT or label</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('sentinel')}
          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-800 hover:bg-rose-50/20 transition text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-rose-600">
              Check Drug Conflicts
            </div>
            <div className="text-[10px] text-slate-500">Polypharmacy sentinel</div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('routine')}
          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 hover:bg-emerald-50/20 transition text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
              Daily Regimen Timeline
            </div>
            <div className="text-[10px] text-slate-500">Log doses & meal timing</div>
          </div>
        </button>

        <button
          onClick={onOpenEmergencyCard}
          className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-800 hover:bg-amber-50/20 transition text-left cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600">
              Print EMS Wallet Card
            </div>
            <div className="text-[10px] text-slate-500">Hospital triage sheet</div>
          </div>
        </button>
      </div>
    </div>
  );
};
