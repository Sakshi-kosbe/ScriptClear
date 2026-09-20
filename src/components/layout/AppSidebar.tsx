import React from 'react';
import {
  LayoutDashboard,
  Files,
  FileCheck2,
  Calendar,
  Pill,
  ShieldAlert,
  HelpCircle,
  Settings,
  CreditCard,
  ArrowLeft,
  X,
  User,
  HeartPulse,
  LogOut,
} from 'lucide-react';
import { WorkspaceView, PatientProfile } from '../../types';
import { useAuth } from '../../hooks/useAuth';

export interface AppSidebarProps {
  currentView: WorkspaceView;
  onSelectView: (view: WorkspaceView) => void;
  onBackToLanding: () => void;
  onOpenEmergencyCard: () => void;
  patient: PatientProfile;
  conflictCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentView,
  onSelectView,
  onBackToLanding,
  onOpenEmergencyCard,
  patient,
  conflictCount,
  isOpenMobile,
  onCloseMobile,
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
  const navItems = [
    {
      id: 'dashboard' as WorkspaceView,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'documents' as WorkspaceView,
      label: 'Documents',
      icon: Files,
    },
    {
      id: 'analysis' as WorkspaceView,
      label: 'Analysis',
      icon: FileCheck2,
    },
    {
      id: 'routine' as WorkspaceView,
      label: 'Daily Routine',
      icon: Calendar,
    },
    {
      id: 'cabinet' as WorkspaceView,
      label: 'Medicine Cabinet',
      icon: Pill,
    },
    {
      id: 'sentinel' as WorkspaceView,
      label: 'Conflict Sentinel',
      icon: ShieldAlert,
      badge: conflictCount > 0 ? `${conflictCount}` : undefined,
      badgeVariant: 'danger',
    },
    {
      id: 'missed' as WorkspaceView,
      label: 'Missed Dose',
      icon: HelpCircle,
    },
    {
      id: 'settings' as WorkspaceView,
      label: 'Settings',
      icon: Settings,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 text-slate-700 dark:text-slate-300">
      {/* Top Header & Logo */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div
            onClick={onBackToLanding}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-xs">
              <Pill className="w-4 h-4 -rotate-45" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-900 dark:text-white leading-none">
                ScriptClear
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                Workspace
              </span>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="md:hidden inline-flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5 shrink-0" />
          </button>
        </div>

        {/* Back to landing link */}
        <div className="px-2">
          <button
            onClick={onBackToLanding}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-600 transition cursor-pointer font-medium py-1 px-1.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            <span>Back to Website</span>
          </button>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  onCloseMobile();
                }}
                className={`w-full inline-flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile & Actions */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        {/* Emergency Wallet Card Trigger */}
        <button
          onClick={onOpenEmergencyCard}
          className="w-full inline-flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition cursor-pointer text-left text-xs shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-4 h-4 text-sky-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900 dark:text-white">EMS Wallet Card</div>
              <div className="text-[10px] text-slate-500">1-click print for ER triage</div>
            </div>
          </div>
          <span className="text-slate-400">&rarr;</span>
        </button>

        {/* User Account & Logout */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-950 flex items-center justify-center font-bold text-xs text-sky-700 dark:text-sky-300 flex-shrink-0">
                {getUserInitials(user?.name || patient.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                  {user?.name || 'Sarah Vance'}
                </div>
                <div className="text-[10px] text-slate-400 truncate capitalize">
                  {user?.role || 'caregiver'} • {user?.email || 'sarah.vance@scriptclear.health'}
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4 shrink-0" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span className="truncate">Care Recipient: {patient.name}</span>
            <span className="flex-shrink-0 text-emerald-600 dark:text-emerald-400 font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex-shrink-0 min-h-screen sticky top-0 h-screen overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="md:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 shadow-2xl transform transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
