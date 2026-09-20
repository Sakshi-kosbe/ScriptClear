import React from 'react';
import { Pill, ArrowRight, Eye, LogIn, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export interface NavbarProps {
  onOpenWorkspace: (tab?: string) => void;
  onNavigateSection: (sectionId: string) => void;
  seniorMode: boolean;
  onToggleSeniorMode: () => void;
  onNavigateAuth?: (mode: 'login' | 'signup') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenWorkspace,
  onNavigateSection,
  seniorMode,
  onToggleSeniorMode,
  onNavigateAuth,
}) => {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => onNavigateSection('hero')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-600 to-sky-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
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

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onNavigateSection('product')}
            className="hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          >
            Product
          </button>
          <button
            onClick={() => onNavigateSection('how-it-works')}
            className="hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          >
            How it Works
          </button>
          <button
            onClick={() => onNavigateSection('features')}
            className="hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          >
            Features
          </button>
          <button
            onClick={() => onNavigateSection('about')}
            className="hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
          >
            About
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Senior High Contrast Mode Toggle */}
          <button
            onClick={onToggleSeniorMode}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              seniorMode
                ? 'bg-amber-100 border-amber-300 text-amber-950 font-black'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
            title="Toggle High-Contrast Senior Accessibility Mode"
          >
            <Eye className="w-3.5 h-3.5 text-amber-600" />
            <span>{seniorMode ? 'High Contrast On' : 'Senior Mode'}</span>
          </button>

          {isAuthenticated ? (
            <Button
              size="sm"
              onClick={() => onOpenWorkspace('dashboard')}
              className="text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Go to Dashboard</span>
            </Button>
          ) : (
            <>
              <button
                onClick={() => {
                  if (onNavigateAuth) {
                    onNavigateAuth('login');
                  } else {
                    onOpenWorkspace('dashboard');
                  }
                }}
                className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition px-3 py-2 cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-400" />
                <span>Sign In</span>
              </button>

              <Button
                size="sm"
                onClick={() => {
                  if (onNavigateAuth) {
                    onNavigateAuth('signup');
                  } else {
                    onOpenWorkspace('documents');
                  }
                }}
                className="text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
