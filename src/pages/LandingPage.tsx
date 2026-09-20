import React from 'react';
import {
  FileText,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  UploadCloud,
  FileCheck2,
  AlertTriangle,
  Pill,
  Volume2,
  Sparkles,
  Stethoscope,
  Lock,
  Eye,
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export interface LandingPageProps {
  onOpenWorkspace: (view?: string) => void;
  seniorMode: boolean;
  onToggleSeniorMode: () => void;
  onOpenEmergencyCard: () => void;
  onResetDemo: () => void;
  onNavigateAuth?: (mode: 'login' | 'signup') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenWorkspace,
  seniorMode,
  onToggleSeniorMode,
  onOpenEmergencyCard,
  onResetDemo,
  onNavigateAuth,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors ${
        seniorMode
          ? 'bg-amber-50/40 text-slate-950 font-sans'
          : 'bg-slate-50 text-slate-900 font-sans dark:bg-slate-950 dark:text-slate-100'
      }`}
    >
      {/* Sticky Clean SaaS Navbar */}
      <Navbar
        onOpenWorkspace={onOpenWorkspace}
        onNavigateSection={scrollTo}
        seniorMode={seniorMode}
        onToggleSeniorMode={onToggleSeniorMode}
        onNavigateAuth={onNavigateAuth}
      />

      <main>
        {/* HERO SECTION */}
        <section id="hero" className="pt-16 pb-20 px-4 sm:px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Clinical Document & Polypharmacy Intelligence</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              Understand Your Documents.{' '}
              <span className="text-sky-600 dark:text-sky-400 block sm:inline">
                Without the Confusion.
              </span>
            </h1>

            {/* Supporting Subtext */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              ScriptClear translates complex pharmacy labels, discharge summaries, and medical
              instructions into clear daily actions—while continuously intercepting hazardous drug
              conflicts before they happen.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => onOpenWorkspace('documents')}
                className="w-full sm:w-auto px-7 py-3 text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Analyze a Document</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo('how-it-works')}
                className="w-full sm:w-auto px-7 py-3 text-sm font-bold"
              >
                See How It Works
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>American Geriatrics Society Beers Criteria</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-sky-600" />
                <span>Zero Server Storage of Health Data</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-amber-600" />
                <span>WCAG AAA Accessible Senior Mode</span>
              </div>
            </div>
          </div>

          {/* REAL PRODUCT PREVIEW (NOT A STOCK ILLUSTRATION) */}
          <div id="product" className="mt-12 sm:mt-16 max-w-5xl mx-auto">
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden">
              {/* Product Window Header */}
              <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <span className="ml-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    ScriptClear Workspace — Live Interactive Preview
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full">
                    Real Analysis Engine
                  </span>
                  <button
                    onClick={() => onOpenWorkspace('dashboard')}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline cursor-pointer"
                  >
                    Launch Full App &rarr;
                  </button>
                </div>
              </div>

              {/* Mock Workspace Split Screen */}
              <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Document Dropzone */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="border-2 border-dashed border-sky-300 dark:border-sky-800 bg-sky-50/40 dark:bg-sky-950/20 rounded-2xl p-6 text-center space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-xs flex items-center justify-center text-sky-600 mx-auto">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        Walgreens-OTC-Advil-400mg.pdf
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Prescription Label • 310 KB
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onOpenWorkspace('documents')}
                      className="w-full text-xs font-semibold"
                    >
                      Analyze Document
                    </Button>
                  </div>

                  {/* Sample Document Chips */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Recent Documents in Vault
                    </span>
                    <div className="space-y-1.5">
                      <div
                        onClick={() => onOpenWorkspace('analysis')}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                          <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                            St-Jude-Cardiology-Discharge.pdf
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex-shrink-0">
                          Analyzed
                        </span>
                      </div>

                      <div
                        onClick={() => onOpenWorkspace('analysis')}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/30 hover:bg-rose-50/60 transition cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                          <span className="font-semibold text-rose-900 dark:text-rose-200 truncate">
                            Walgreens-OTC-Advil-400mg.pdf
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100 dark:bg-rose-950 px-2 py-0.5 rounded-full flex-shrink-0">
                          Hazard
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Analysis Output View */}
                <div className="lg:col-span-7 space-y-4 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-left">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Live Analysis Result
                    </span>
                    <span className="text-[10px] font-bold text-sky-600">
                      4th-Grade Readability
                    </span>
                  </div>

                  {/* Summary */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Plain Summary
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      "Ibuprofen 400mg oral tablet for knee arthritis. <strong>DO NOT TAKE:</strong> This drug damages the stomach lining and causes severe internal bleeding when combined with your active Warfarin."
                    </p>
                  </div>

                  {/* Potential Concerns */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Potential Concerns</span>
                    </div>
                    <div className="text-xs p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 font-medium">
                      ⚠ Multiplies gastrointestinal hemorrhage risk by 3.5x with Warfarin Sodium.
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Suggested Next Step</span>
                    </div>
                    <div className="text-xs p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200 font-medium">
                      ✓ Call Dr. Evelyn Chen to request topical analgesics or monitored acetaminophen.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Step-by-Step Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              From Complex Jargon to Complete Peace of Mind
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Three streamlined steps protecting older adults and caregivers from dangerous medication errors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 font-black text-sm flex items-center justify-center">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Upload Document or Label
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Drop in pharmacy bottle photos, hospital discharge PDFs, or clinic care plans. Our ingestion engine extracts active molecules and clinical directives.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 font-black text-sm flex items-center justify-center">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Automated Sentinel Cross-Check
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                ScriptClear compares the document against your active prescriptions, known allergies, and AGS Beers Criteria to flag fatal contraindications.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 font-black text-sm flex items-center justify-center">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daily Routine & Wallet Triage
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Receive plain-language morning, noon, evening, and bedtime instructions with visual pill shapes and a 1-click standardized EMS emergency wallet card.
              </p>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Core Capabilities
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Engineered for High-Stakes Patient Safety
              </h2>
            </div>
            <Button
              size="sm"
              onClick={() => onOpenWorkspace('dashboard')}
              className="text-xs font-semibold"
            >
              Open Workspace &rarr;
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 flex items-center justify-center mb-3">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                4th-Grade Plain Language
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Converts cryptic Latin shorthand like "take q.d. with meals" into simple, reassuring directions anyone can follow without anxiety.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center mb-3">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Real-Time Conflict Sentinel
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Flags dangerous clashes like internal bleeding from Warfarin + NSAIDs, hyperkalemia from ACE inhibitors, and adverse food interactions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mb-3">
                <Pill className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Visual Pill Identifier
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Eliminates confusion between multiple white tablets by rendering authentic pill shapes (capsule, diamond, oval, round) and custom colors.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center mb-3">
                <Volume2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Voice Readout Audio
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Native Web Speech audio readouts designed for visually impaired seniors who struggle to read prescription labels.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-3">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Missed Dose Clinical Advisor
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Interactive hours-late slider gives immediate safety advice: take immediately, adjust meal timing, or skip safely to prevent toxic overdose.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-3">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Senior High Contrast Mode
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                High-contrast amber/slate palettes and generous touch targets complying with WCAG AAA accessibility standards for older eyes.
              </p>
            </div>
          </div>
        </section>

        {/* ABOUT & CLINICAL FOUNDATION */}
        <section id="about" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              The Polypharmacy Crisis in Numbers
            </span>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight max-w-2xl">
              Why We Built ScriptClear: Protecting 54 Million Older Americans
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              Adverse drug events cause over <strong>1.3 million emergency room visits</strong> annually in the US alone.
              As patients age and develop co-morbidities like Eleanor Vance's atrial fibrillation, hypertension,
              and type 2 diabetes, managing 4 to 8 different bottles with conflicting instructions becomes dangerous.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-black text-sky-400 mb-1">1.3M+</div>
                <div className="text-xs text-slate-300">
                  Annual US emergency room visits caused by accidental medication errors & interactions.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-black text-amber-400 mb-1">50%+</div>
                <div className="text-xs text-slate-300">
                  Of seniors misunderstand timing or take doses irregularly due to fine print.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-3xl font-black text-emerald-400 mb-1">AGS Beers</div>
                <div className="text-xs text-slate-300">
                  Standardized criteria for potentially inappropriate medication use in older adults.
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                Default Patient Baseline: Eleanor Vance (74) • Blood Type: A+ • Penicillin Allergy
              </div>

              <Button
                size="sm"
                onClick={() => onOpenWorkspace('documents')}
                className="text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white"
              >
                Launch Document Workspace &rarr;
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Clean SaaS Footer */}
      <Footer
        onNavigateTab={() => onOpenWorkspace('dashboard')}
        onOpenEmergencyCard={onOpenEmergencyCard}
        onOpenJudgeModal={() => onOpenWorkspace('settings')}
        onResetDemo={onResetDemo}
      />
    </div>
  );
};
