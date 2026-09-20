import React from 'react';
import { Pill, ShieldCheck, ArrowLeft } from 'lucide-react';

export interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  onNavigateHome?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  onNavigateHome,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 font-sans selection:bg-sky-500/20">
      {/* Top Bar with brand and back button */}
      <header className="max-w-md w-full mx-auto flex items-center justify-between">
        <div
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Pill className="w-5 h-5 -rotate-45" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
              ScriptClear
            </span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
              Medical Intelligence
            </span>
          </div>
        </div>

        {onNavigateHome && (
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to site</span>
          </button>
        )}
      </header>

      {/* Main Form Container */}
      <main className="max-w-md w-full mx-auto my-auto py-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Header */}
          <div className="mb-6 text-center sm:text-left space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          </div>

          {/* Body Content */}
          {children}
        </div>

        {/* Security / Compliance Reassurance */}
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-xs text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          <span>Client-side encrypted session • Clinical-grade privacy standards</span>
        </div>
      </main>

      {/* Bottom Legal / Copyright */}
      <footer className="text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} ScriptClear Medical Intelligence Inc. All rights reserved.
      </footer>
    </div>
  );
};
