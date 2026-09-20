import React from 'react';
import {
  ShieldAlert,
  Calendar,
  Pill,
  Camera,
  Volume2,
  VolumeX,
  CreditCard,
  Eye,
  HelpCircle,
} from 'lucide-react';
import { stopSpeech } from '../utils/speech';

interface HeaderProps {
  activeTab: 'schedule' | 'cabinet' | 'conflicts' | 'scanner' | 'missed';
  setActiveTab: (tab: 'schedule' | 'cabinet' | 'conflicts' | 'scanner' | 'missed') => void;
  seniorMode: boolean;
  setSeniorMode: (val: boolean) => void;
  isSpeaking: boolean;
  onOpenEmergencyCard: () => void;
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
  conflictCount,
  allergyCount,
  pillCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner / Accessibility Bar */}
      <div className="bg-slate-900 text-white px-4 py-2 text-xs md:text-sm font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              FDA & Geriatric Safety Aligned
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="text-slate-300">
              Patient: <strong className="text-white">Eleanor Vance (Age 74)</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Audio Indicator if speaking */}
            {isSpeaking && (
              <button
                onClick={stopSpeech}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition cursor-pointer"
                title="Stop reading aloud"
              >
                <VolumeX className="w-3.5 h-3.5 animate-bounce" />
                <span>Stop Voice</span>
              </button>
            )}

            {/* Senior Mode Toggle */}
            <button
              onClick={() => setSeniorMode(!seniorMode)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition cursor-pointer text-xs ${
                seniorMode
                  ? 'bg-amber-400 text-slate-950 shadow-sm ring-2 ring-amber-300'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{seniorMode ? 'Senior Mode: ON (High Contrast)' : 'Senior High-Contrast Mode'}</span>
            </button>

            {/* Emergency Wallet Card Export */}
            <button
              onClick={onOpenEmergencyCard}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-900/80 text-rose-200 border border-rose-700/60 hover:bg-rose-800 transition cursor-pointer text-xs"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Print</span> Wallet Card
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Brand & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-md">
              <Pill className="w-6 h-6 rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Script<span className="text-sky-600">Clear</span>
                </h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-100 text-sky-800 uppercase tracking-wider">
                  Prescription Sentinel
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Plain-Language Polypharmacy Safety & Visual Daily Routine
              </p>
            </div>
          </div>

          {/* Quick Scanner Action on Mobile */}
          <button
            onClick={() => setActiveTab('scanner')}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 text-white font-semibold text-xs shadow-sm hover:bg-sky-700"
          >
            <Camera className="w-4 h-4" />
            <span>Scan Bottle</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Today's Routine</span>
          </button>

          <button
            onClick={() => setActiveTab('cabinet')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'cabinet'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Cabinet</span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === 'cabinet' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {pillCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('conflicts')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'conflicts'
                ? 'bg-rose-600 text-white shadow-sm'
                : conflictCount > 0 || allergyCount > 0
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>Safety Sentinel</span>
            {conflictCount > 0 || allergyCount > 0 ? (
              <span className="text-xs px-1.5 py-0.5 rounded-full font-black bg-rose-600 text-white animate-pulse">
                {conflictCount + allergyCount}
              </span>
            ) : null}
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'scanner'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>AI Label Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab('missed')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'missed'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Missed Dose?</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
