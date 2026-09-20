import React from 'react';
import { Menu, Search, Eye, Volume2, Bell, Sparkles, LogOut, User as UserIcon } from 'lucide-react';
import { WorkspaceView, PatientProfile } from '../../types';
import { useAuth } from '../../hooks/useAuth';

export interface AppHeaderProps {
  currentView: WorkspaceView;
  onOpenMobileNav: () => void;
  seniorMode: boolean;
  onToggleSeniorMode: () => void;
  patient: PatientProfile;
  isSpeaking: boolean;
  onStopSpeech: () => void;
  documentTitle?: string;
  onLogout?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentView,
  onOpenMobileNav,
  seniorMode,
  onToggleSeniorMode,
  patient,
  isSpeaking,
  onStopSpeech,
  documentTitle,
  onLogout,
}) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    if (onLogout) {
      onLogout();
    }
  };

  const getUserInitials = (name?: string) => {
    if (!name) return 'SC';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };
  const viewTitles: Record<WorkspaceView, string> = {
    dashboard: 'Dashboard Overview',
    documents: 'Document & Prescription Vault',
    analysis: documentTitle ? `Analysis: ${documentTitle}` : 'Clinical Document Analysis',
    routine: '24-Hour Daily Regimen Routine',
    cabinet: 'Active Medicine Cabinet',
    sentinel: 'Polypharmacy Conflict Sentinel',
    missed: 'Pharmacist Missed Dose Advisor',
    settings: 'Workspace Settings & Caregiver Profile',
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Nav Button + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileNav}
            className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col min-w-0">
            <div className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Workspace / {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {viewTitles[currentView]}
            </h1>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {isSpeaking && (
            <button
              onClick={onStopSpeech}
              className="inline-flex items-center justify-center gap-1.5 h-9 min-h-[36px] px-3.5 rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800 text-xs font-semibold animate-pulse cursor-pointer shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              <Volume2 className="w-4 h-4 shrink-0" />
              <span>Stop Audio</span>
            </button>
          )}

          {/* High Contrast Toggle */}
          <button
            onClick={onToggleSeniorMode}
            className={`inline-flex items-center justify-center gap-1.5 h-9 min-h-[36px] px-3.5 rounded-xl text-xs font-semibold border transition cursor-pointer shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${
              seniorMode
                ? 'bg-amber-100 border-amber-300 text-amber-950 font-black'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Toggle Senior High Contrast"
          >
            <Eye className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="hidden sm:inline">
              {seniorMode ? 'High Contrast On' : 'Senior Mode'}
            </span>
          </button>

          {/* Caregiver & User profile tag */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-xs shrink-0">
              {getUserInitials(user?.name || patient.name)}
            </div>
            <div className="text-xs">
              <div className="font-semibold text-slate-900 dark:text-white leading-tight">
                {user?.name || patient.name}
              </div>
              <div className="text-[10px] text-slate-400 capitalize">
                {user?.role ? `${user.role} • ` : ''}Care Recipient: {patient.name.split(' ')[0]}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-1.5 h-9 min-h-[36px] px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition cursor-pointer shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            title="Sign out of ScriptClear"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
