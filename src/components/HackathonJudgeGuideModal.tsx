import React from 'react';
import { X, Award, CheckCircle, Sparkles, ShieldAlert, Cpu, HeartHandshake } from 'lucide-react';

interface HackathonJudgeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunConflictDemo: () => void;
  onRunRoutineDemo: () => void;
}

export const HackathonJudgeGuideModal: React.FC<HackathonJudgeGuideModalProps> = ({
  isOpen,
  onClose,
  onRunConflictDemo,
  onRunRoutineDemo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black flex items-center gap-1.5 border border-amber-300">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            HACKDAY 1.0 — Judge & Evaluation Guide
          </span>
        </div>

        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          ScriptClear: Alignment With Official Judging Criteria
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 mb-6">
          Theme: <strong>Tech for a Better Tomorrow</strong> • Target Demographic: Geriatric patients & polypharmacy caregivers
        </p>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          {/* Criterion 1 */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-sky-950 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-sky-600" />
                1. Problem & Impact (25% Evaluation Weight)
              </h4>
              <span className="font-bold text-sky-800 text-xs">High Real-World Urgency</span>
            </div>
            <p className="text-xs text-sky-900 leading-relaxed">
              Over 50% of elderly patients misunderstand prescription labels. Adverse drug events cause 1.3 million ER visits annually. ScriptClear turns complex clinical jargon into plain 4th-grade directions, tracks 24-hour visual meals/timing, and eliminates accidental double-doses.
            </p>
          </div>

          {/* Criterion 2 */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-purple-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                2. Innovation & Differentiation (20% Evaluation Weight)
              </h4>
              <span className="font-bold text-purple-800 text-xs">Beyond Generic Reminders</span>
            </div>
            <p className="text-xs text-purple-900 leading-relaxed">
              Unlike generic alarm/to-do apps, ScriptClear features a deterministic <strong>Polypharmacy Safety Sentinel</strong>. It cross-checks incoming prescriptions against the patient's existing regimen (e.g. Warfarin + Advil = Fatal hemorrhage alert), detects cross-reactive allergies, enforces dietary rules (Grapefruit/Lipitor), and generates custom doctor questions.
            </p>
          </div>

          {/* Criterion 3 */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-emerald-950 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-emerald-600" />
                3. Technical Implementation & Reliability (25% Weight)
              </h4>
              <span className="font-bold text-emerald-800 text-xs">Robust & Zero-Failure Demo</span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Engineered with React 19, Vite, and Tailwind CSS. Employs browser-native Web Speech API for instant voice accessibility, LocalStorage persistence for compliance tracking, and dynamic visual pill rendering (custom CSS shapes & colors) so seniors recognize their pills optically.
            </p>
          </div>

          {/* Criterion 4 & 5 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <h5 className="font-bold text-slate-900 text-xs mb-1">4. UI/UX Craft (15%)</h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Accessible Senior High-Contrast Mode, 44px+ touch targets, zero cognitive clutter, and instant audio feedback for low-literacy users.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <h5 className="font-bold text-slate-900 text-xs mb-1">5. Scalability & Feasibility (15%)</h5>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Seamless integration with pharmacy APIs (CVS/Walgreens/NHS), smart pill dispensers, and Medicare home health protocols.
              </p>
            </div>
          </div>
        </div>

        {/* 90-Second Live Demo Triggers */}
        <div className="mt-6 pt-4 border-t border-slate-200">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Instant 90-Second Demo Shortcuts:
          </span>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                onClose();
                onRunRoutineDemo();
              }}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>Demo 1: 24h Daily Routine & Voice Readout</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onRunConflictDemo();
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <span>Demo 2: Catch Fatal Warfarin + Advil Conflict</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
