import React, { useState } from 'react';
import { HelpCircle, AlertOctagon, Clock, Volume2, CheckCircle2 } from 'lucide-react';
import { Medication } from '../types';
import { PillVisual } from './PillVisual';
import { speakText } from '../utils/speech';

interface MissedDoseAdvisorProps {
  medications: Medication[];
  seniorMode: boolean;
}

export const MissedDoseAdvisor: React.FC<MissedDoseAdvisorProps> = ({
  medications,
  seniorMode,
}) => {
  const [selectedMedId, setSelectedMedId] = useState(medications[0]?.id || '');
  const [hoursLate, setHoursLate] = useState<number>(3);

  const selectedMed = medications.find((m) => m.id === selectedMedId) || medications[0];

  // Clinical guidance logic
  let adviceTitle = '';
  let adviceBody = '';
  let severity: 'safe' | 'caution' | 'danger' = 'caution';

  if (selectedMed) {
    const isWarfarin = selectedMed.genericName.toLowerCase().includes('warfarin');
    const isMetformin = selectedMed.genericName.toLowerCase().includes('metformin');
    const isLisinopril = selectedMed.genericName.toLowerCase().includes('lisinopril');

    if (hoursLate <= 4) {
      severity = 'safe';
      adviceTitle = 'Take Your Missed Dose Now With Water';
      adviceBody = `You are only ${hoursLate} hours past your scheduled time. Take your normal 1 dose right now. Then continue your regular routine tomorrow. NEVER take two pills at your next scheduled time.`;
    } else if (hoursLate <= 8) {
      severity = 'caution';
      if (isWarfarin) {
        adviceTitle = 'Take Dose Today, But Do Not Double Tomorrow';
        adviceBody = `For Warfarin (Coumadin), take your regular dose as soon as you remember today. If you do not remember until the next morning, SKIP the missed dose completely and resume your normal evening schedule. Never take a double dose to make up for a missed tablet.`;
      } else if (isMetformin) {
        adviceTitle = 'Take With a Snack If More Than 4 Hours Until Next Dose';
        adviceBody = `Since Metformin is extended-release and taken with dinner, take it now ONLY if you eat a light meal or snack with it. If it is already close to bedtime or your next meal, skip the missed dose.`;
      } else {
        adviceTitle = 'Take Now If More Than 6 Hours Before Next Dose';
        adviceBody = `Take the missed dose now with water. However, if your next scheduled dose is less than 6 hours away, skip this dose completely and resume normal timing.`;
      }
    } else {
      severity = 'danger';
      adviceTitle = 'SKIP This Missed Dose Completely';
      adviceBody = `You are ${hoursLate} hours past your scheduled window. Taking this dose now would put too much medication in your body before your next regular dose. SKIP THIS DOSE. Do NOT double up. Resume your normal schedule at the next designated time.`;
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Immediate Safety Guidance
          </span>
        </div>
        <h2 className={`font-black tracking-tight text-slate-900 ${seniorMode ? 'text-2xl' : 'text-xl'}`}>
          "I Forgot to Take My Pill" — Missed Dose Advisor
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Accidental double-dosing is one of the most common causes of elderly ER visits. Find out exactly what to do safely without panic.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Input selector */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-5 shadow-xs">
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
              1. Which Medication Did You Miss?
            </label>
            <div className="space-y-2">
              {medications.map((med) => (
                <button
                  key={med.id}
                  onClick={() => setSelectedMedId(med.id)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                    selectedMedId === med.id
                      ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <PillVisual medication={med} size="sm" />
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">{med.brandName}</h4>
                      <span className="text-xs text-slate-500">
                        {med.genericName} • {med.dosage}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 capitalize">
                    {med.timeOfDay.join(', ')}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                2. How Many Hours Ago Was It Due?
              </label>
              <span className="text-sm font-black text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full">
                {hoursLate} hour{hoursLate !== 1 ? 's' : ''} late
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="16"
              value={hoursLate}
              onChange={(e) => setHoursLate(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-bold mt-1">
              <span>1 hr (Just missed)</span>
              <span>8 hrs (Half day)</span>
              <span>16 hrs (Almost next dose)</span>
            </div>
          </div>
        </div>

        {/* Right: Clinically grounded guidance card */}
        <div className="space-y-4">
          <div
            className={`p-6 rounded-3xl border-2 shadow-sm space-y-4 ${
              severity === 'safe'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : severity === 'caution'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  severity === 'safe'
                    ? 'bg-emerald-200 text-emerald-900'
                    : severity === 'caution'
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-rose-200 text-rose-900'
                }`}
              >
                {severity === 'safe' ? 'Safe Window' : severity === 'caution' ? 'Moderate Delay' : 'Late Delay — Do Not Double'}
              </span>
              <span className="text-xs font-bold opacity-80">{selectedMed?.brandName}</span>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-black">{adviceTitle}</h3>
              <p className="text-xs sm:text-sm mt-2 leading-relaxed font-medium">
                {adviceBody}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/80 border border-black/10 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider block opacity-70">
                Universal Golden Rule
              </span>
              <p className="text-xs font-black text-rose-800">
                🛑 NEVER take two doses at the same time to make up for a missed dose.
              </p>
            </div>

            <button
              onClick={() => speakText(`${adviceTitle}. ${adviceBody}. Remember: Never take two doses at once.`)}
              className="w-full inline-flex items-center justify-center gap-2 h-10 min-h-[40px] px-4 rounded-xl bg-white text-slate-800 border border-slate-300 font-bold text-xs sm:text-sm hover:bg-slate-50 transition cursor-pointer shadow-xs shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <Volume2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Read Advice Aloud</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">When in Doubt:</span>
            <p>
              Call Eleanor's pharmacy at{' '}
              <strong className="text-sky-700">{selectedMed?.pharmacyPhone || '(555) 234-5678'}</strong> or Dr. Martinez at{' '}
              <strong className="text-sky-700">(555) 382-9011</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
