import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Copy,
  Check,
  Volume2,
  Apple,
  Wine,
  HelpCircle,
  FileQuestion,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import { Medication, PatientProfile } from '../types';
import { analyzeMedicationSafety } from '../utils/conflictChecker';
import { speakText } from '../utils/speech';

interface ConflictSentinelProps {
  medications: Medication[];
  patient: PatientProfile;
  seniorMode: boolean;
  onSelectPreset: (presetId: string) => void;
}

export const ConflictSentinel: React.FC<ConflictSentinelProps> = ({
  medications,
  patient,
  seniorMode,
  onSelectPreset,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const safetyResult = analyzeMedicationSafety(medications, patient);
  const { conflicts, allergyAlerts, foodWarnings, polypharmacyScore, doctorQuestions } = safetyResult;

  const handleCopyQuestion = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const hasCritical = conflicts.some((c) => c.severity === 'critical') || allergyAlerts.length > 0;

  return (
    <div className="space-y-6">
      {/* Sentinel Status Banner */}
      <div
        className={`p-6 rounded-3xl border transition-all ${
          hasCritical
            ? 'bg-rose-50 border-rose-300 text-rose-950 shadow-md ring-2 ring-rose-300/60'
            : 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs ${
                hasCritical ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-600 text-white'
              }`}
            >
              {hasCritical ? <AlertOctagon className="w-7 h-7" /> : <CheckCircle2 className="w-7 h-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`font-black tracking-tight ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
                  {hasCritical ? 'Hazard Alert: Safety Conflicts Detected!' : 'All Clear: No Fatal Drug Conflicts'}
                </h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                    hasCritical ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'
                  }`}
                >
                  {polypharmacyScore.complexityLevel} Complexity
                </span>
              </div>
              <p className="text-xs sm:text-sm mt-1 text-slate-700 max-w-2xl leading-relaxed">
                {hasCritical
                  ? `ScriptClear flagged ${conflicts.length} drug interaction(s) and ${allergyAlerts.length} allergy conflict(s). Review urgent action instructions below.`
                  : `Analyzed ${medications.length} active prescriptions across ${polypharmacyScore.timingSlotsCovered} daily time windows against Eleanor's known health records.`}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (hasCritical) {
                const conflictDesc = conflicts.map((c) => `${c.headline}. ${c.plainExplanation}`).join('. ');
                speakText(`Warning. Safety conflict detected. ${conflictDesc}`);
              } else {
                speakText(`Your current medication regimen has no critical drug conflicts. Remember to follow dietary guidelines.`);
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 font-bold text-xs shadow-xs transition cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-sky-600" />
            <span>Read Safety Report Aloud</span>
          </button>
        </div>
      </div>

      {/* Critical Allergy Conflicts */}
      {allergyAlerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-black text-rose-800 text-base flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-600" />
            Patient Allergy Contraindications ({allergyAlerts.length})
          </h3>
          {allergyAlerts.map((aa, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-rose-100/70 border-2 border-rose-400 text-rose-950 space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-xs font-black bg-rose-600 text-white">
                  ALLERGY CONTRAINDICATION
                </span>
                <span className="text-xs font-bold text-rose-800">
                  Target Allergen: {aa.allergen}
                </span>
              </div>
              <h4 className="font-black text-base text-rose-950">
                {aa.medicationName} triggers {aa.allergen} reaction!
              </h4>
              <p className="text-xs sm:text-sm text-rose-900 leading-relaxed font-medium">
                {aa.warning}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Drug-Drug Conflicts */}
      {conflicts.length > 0 ? (
        <div className="space-y-3">
          <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            Drug-to-Drug Interactions ({conflicts.length})
          </h3>
          <div className="space-y-4">
            {conflicts.map((conflict) => (
              <div
                key={conflict.id}
                className="p-5 rounded-2xl bg-white border-2 border-rose-300 shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rose-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-600 text-white">
                      {conflict.severity.toUpperCase()} RISK
                    </span>
                    <h4 className="font-black text-slate-900 text-base">
                      {conflict.drugAName} + {conflict.drugBName}
                    </h4>
                  </div>
                  <span className="text-xs text-rose-700 font-bold">{conflict.headline}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200">
                  <h5 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-1">
                    Plain-Language Explanation for Patients
                  </h5>
                  <p className="text-sm text-rose-950 leading-relaxed font-medium">
                    {conflict.plainExplanation}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                  <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                    Recommended Patient Action
                  </h5>
                  <p className="text-sm text-amber-950 font-bold">
                    👉 {conflict.actionRequired}
                  </p>
                </div>

                <div className="text-[11px] text-slate-500 font-mono">
                  Clinical Mechanism: {conflict.clinicalMechanism}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">No Active Drug-Drug Conflicts</h4>
              <p className="text-xs text-slate-500">
                Eleanor's active 4 prescriptions (Warfarin, Lisinopril, Metformin, Lipitor) are safe to take together when separated into their respective morning, evening, and bedtime slots.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Quick-Test Sandbox */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-black text-base text-white">Interactive Hackathon Conflict Demo Lab</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Click a real-world scenario preset below to see how ScriptClear immediately catches life-threatening conflicts live on stage:
            </p>
          </div>
          <span className="text-[11px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300">
            Live Testing Sandbox
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => onSelectPreset('preset-ibuprofen')}
            className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-rose-400 hover:bg-slate-800 text-left transition cursor-pointer group"
          >
            <span className="text-xs font-bold text-rose-400 block mb-1">🚨 Add OTC Advil/Ibuprofen</span>
            <p className="text-xs text-slate-300 group-hover:text-white leading-relaxed">
              Triggers the fatal internal bleeding contraindication with Warfarin.
            </p>
          </button>

          <button
            onClick={() => onSelectPreset('preset-amoxicillin')}
            className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-amber-400 hover:bg-slate-800 text-left transition cursor-pointer group"
          >
            <span className="text-xs font-bold text-amber-400 block mb-1">🛑 Add Amoxicillin Rx</span>
            <p className="text-xs text-slate-300 group-hover:text-white leading-relaxed">
              Triggers the cross-reactive allergy alarm against documented Penicillin allergy.
            </p>
          </button>

          <button
            onClick={() => onSelectPreset('preset-levothyroxine')}
            className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-sky-400 hover:bg-slate-800 text-left transition cursor-pointer group"
          >
            <span className="text-xs font-bold text-sky-400 block mb-1">☕ Add Levothyroxine (Synthroid)</span>
            <p className="text-xs text-slate-300 group-hover:text-white leading-relaxed">
              Tests strict empty-stomach timing and morning coffee/calcium blocks.
            </p>
          </button>
        </div>
      </div>

      {/* Cumulative Food & Lifestyle Rules */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
        <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
          <Apple className="w-5 h-5 text-amber-600" />
          Cumulative Food, Drink & Herbal Warnings
        </h3>
        <p className="text-xs text-slate-600">
          Certain healthy foods and supplements interfere with how your liver and stomach process these medications.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {foodWarnings.map((fw, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-900">{fw.warning.item}</span>
                <span className="text-[11px] font-medium text-slate-500">for {fw.medicationName}</span>
              </div>
              <p className="text-xs text-amber-800 font-medium">{fw.warning.hazard}</p>
              <p className="text-xs text-amber-950 font-bold pt-1 border-t border-amber-200/50">
                👉 Rule: {fw.warning.recommendation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor & Pharmacist Discussion Script */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-sky-600" />
            <h3 className="font-black text-slate-900 text-base">
              Personalized Doctor & Pharmacist Discussion Script
            </h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">1-Click Copy for Clinic Visit</span>
        </div>
        <p className="text-xs text-slate-600">
          Take these exact plain-language questions to Eleanor's next appointment with Dr. Martinez:
        </p>

        <div className="space-y-2 pt-2">
          {doctorQuestions.map((q, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
            >
              <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed italic">{q}</p>
              <button
                onClick={() => handleCopyQuestion(q, idx)}
                className="inline-flex items-center justify-center gap-1.5 h-8 min-h-[32px] px-3 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold shrink-0 whitespace-nowrap transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
