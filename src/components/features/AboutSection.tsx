import React from 'react';
import { ShieldCheck, Heart, AlertOctagon, CheckCircle2, UserCheck, Stethoscope } from 'lucide-react';
import { PatientProfile } from '../../types';

export interface AboutSectionProps {
  patient: PatientProfile;
  onOpenJudgeModal: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ patient, onOpenJudgeModal }) => {
  return (
    <section className="py-12 border-t border-slate-200/80 dark:border-slate-800">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-xl border border-slate-800">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Clinical Background & Polypharmacy Crisis</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Why ScriptClear Was Built: Protecting Eleanor & 54 Million Seniors
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            In the United States alone, adverse drug events cause over <strong>1.3 million emergency room visits</strong> annually,
            with seniors twice as likely to be hospitalized. As patients develop multiple chronic conditions—such as Eleanor's
            hypertension, atrial fibrillation, and type 2 diabetes—managing 4 to 8 different bottles with conflicting instructions
            becomes dangerous.
          </p>

          {/* Key Clinical Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-black text-sky-400 mb-1">1.3M+</div>
              <div className="text-xs text-slate-300">
                Annual US emergency room visits caused by accidental medication errors & interactions.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-black text-amber-400 mb-1">50%+</div>
              <div className="text-xs text-slate-300">
                Of older adults misunderstand timing or take doses irregularly due to fine print.
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-black text-emerald-400 mb-1">AGS Beers</div>
              <div className="text-xs text-slate-300">
                Standardized criteria for potentially inappropriate medication use in older adults.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-sky-400 border border-slate-700">
                EV
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">Default Baseline Profile: {patient.name} ({patient.age})</div>
                <div className="text-slate-400">
                  Allergies: {patient.knownAllergies.join(', ')} • MD: {patient.primaryDoctor}
                </div>
              </div>
            </div>

            <button
              onClick={onOpenJudgeModal}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition cursor-pointer shadow-xs"
            >
              View Judging Evaluation Criteria &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
