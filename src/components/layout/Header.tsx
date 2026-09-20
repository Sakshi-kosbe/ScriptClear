import React from 'react';
import {
  ShieldAlert,
  Calendar,
  Pill,
  Camera,
  VolumeX,
  CreditCard,
  Eye,
  HelpCircle,
  Menu,
  X,
  Sparkles,
  Award,
} from 'lucide-react';
import { stopSpeech } from '../../utils/speech';
import { TabType } from '../../types';
import { NAV_ITEMS } from '../../constants/navigation';

export interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  seniorMode: boolean;
  setSeniorMode: (val: boolean) => void;
  isSpeaking: boolean;
  onOpenEmergencyCard: () => void;
  onOpenJudgeModal?: () => void;
  conflictCount: number;
  allergyCount: number;
  pillCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  seniorMode,
  setSeniorMode,
  isSpeaking,
  onOpenEmergencyCard,
  onOpenJudgeModal,
  conflictCount,
  allergyCount,
  pillCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const totalSafetyAlerts = conflictCount + allergyCount;

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
      {/* Top Banner / Accessibility & Patient Context Bar */}
      <div className="bg-slate-950 text-white px-4 py-2 text-xs md:text-sm font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 text-[11px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              FDA & Geriatric Beers Aligned
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="text-slate-300 text-xs sm:text-sm">
              Patient: <strong className="text-white font-bold">Eleanor Vance (Age 74)</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Indicator if speaking */}
            {isSpeaking && (
              <button
                onClick={stopSpeech}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition cursor-pointer text-xs shadow-xs"
                title="Stop reading aloud"
                aria-label="Stop text-to-speech voice"
              >
                <VolumeX className="w-3.5 h-3.5 animate-bounce" />
                <span>Stop Voice</span>
              </button>
            )}

            {/* Senior Mode High-Contrast Toggle */}
            <button
              onClick={() => setSeniorMode(!seniorMode)}
              aria-pressed={seniorMode}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold transition cursor-pointer text-xs ${
                seniorMode
                  ? 'bg-amber-400 text-slate-950 shadow-sm ring-2 ring-amber-300'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{seniorMode ? 'Senior Mode: ON' : 'Senior High Contrast'}</span>
            </button>

            {/* Emergency Wallet Card Export */}
            <button
              onClick={onOpenEmergencyCard}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-900/80 text-rose-200 border border-rose-700/60 hover:bg-rose-800 transition cursor-pointer text-xs font-semibold"
              title="View and print standardized EMS Emergency Wallet Card"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span> Wallet Card
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Brand & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-sky-600/20">
            <Pill className="w-5 h-5 rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Script<span className="text-sky-600 dark:text-sky-400">Clear</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-extrabold bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 uppercase tracking-wider">
                Rx Sentinel
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Plain-Language Polypharmacy Safety & Visual Daily Routine
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isSentinel = item.id === 'conflicts';

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? isSentinel
                      ? 'bg-rose-600 text-white shadow-sm'
                      : item.id === 'missed'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-sm'
                    : isSentinel && totalSafetyAlerts > 0
                    ? 'text-rose-700 bg-rose-100/60 dark:bg-rose-950/40 hover:bg-rose-100'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isSentinel && totalSafetyAlerts > 0 && !isActive ? 'text-rose-600 animate-pulse' : ''
                  }`}
                />
                <span>{item.label}</span>

                {item.id === 'cabinet' && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive
                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-200'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {pillCount}
                  </span>
                )}

                {isSentinel && totalSafetyAlerts > 0 && (
                  <span className="text-[11px] px-1.5 py-0.2 rounded-full font-black bg-rose-600 text-white animate-pulse">
                    {totalSafetyAlerts}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Actions: Scanner Shortcut + Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setActiveTab('scanner')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-sm hover:bg-sky-700 transition"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan Rx</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Tablet & Mobile Tab Bar (Horizontal Scroll) */}
      <div className="lg:hidden border-t border-slate-200/60 dark:border-slate-800 px-4 py-2 overflow-x-auto scrollbar-none flex items-center gap-1.5 bg-slate-50/70 dark:bg-slate-900/60">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isSentinel = item.id === 'conflicts';

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? isSentinel
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-sky-600 text-white shadow-xs'
                  : isSentinel && totalSafetyAlerts > 0
                  ? 'bg-rose-100 text-rose-800 font-black'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.shortLabel || item.label}</span>
              {item.id === 'cabinet' && <span>({pillCount})</span>}
              {isSentinel && totalSafetyAlerts > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {totalSafetyAlerts}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Drawer (When hamburger toggled) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 space-y-2 shadow-lg">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Navigation Menu
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <div className="text-left">
                    <div>{item.label}</div>
                    <div className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
                      {item.description}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
