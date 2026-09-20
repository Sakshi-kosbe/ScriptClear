import React, { useState } from 'react';
import {
  Sun,
  SunMedium,
  Sunset,
  Moon,
  CheckCircle2,
  Circle,
  Volume2,
  AlertTriangle,
  Flame,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { Medication, TimeOfDay, DoseLog } from '../types';
import { PillVisual } from './PillVisual';
import { speakText } from '../utils/speech';

interface DailyTimelineProps {
  medications: Medication[];
  doseLogs: DoseLog[];
  onToggleDose: (medicationId: string, slot: TimeOfDay) => void;
  seniorMode: boolean;
  onOpenScanner: () => void;
}

const TIME_SLOTS: {
  id: TimeOfDay;
  label: string;
  timeWindow: string;
  mealContext: string;
  icon: React.ElementType;
  accentBg: string;
  accentBorder: string;
  accentText: string;
}[] = [
  {
    id: 'morning',
    label: 'Morning Dose',
    timeWindow: '7:30 AM – 9:00 AM',
    mealContext: 'Take around breakfast or upon waking',
    icon: Sun,
    accentBg: 'bg-amber-50',
    accentBorder: 'border-amber-200',
    accentText: 'text-amber-800',
  },
  {
    id: 'noon',
    label: 'Afternoon / Lunch',
    timeWindow: '12:00 PM – 1:30 PM',
    mealContext: 'Take with midday lunch or snack',
    icon: SunMedium,
    accentBg: 'bg-sky-50',
    accentBorder: 'border-sky-200',
    accentText: 'text-sky-800',
  },
  {
    id: 'evening',
    label: 'Evening / Dinner',
    timeWindow: '6:00 PM – 7:30 PM',
    mealContext: 'Take with evening meal',
    icon: Sunset,
    accentBg: 'bg-orange-50',
    accentBorder: 'border-orange-200',
    accentText: 'text-orange-800',
  },
  {
    id: 'bedtime',
    label: 'Bedtime',
    timeWindow: '9:30 PM – 10:30 PM',
    mealContext: 'Take right before sleep with water',
    icon: Moon,
    accentBg: 'bg-indigo-50',
    accentBorder: 'border-indigo-200',
    accentText: 'text-indigo-800',
  },
];

export const DailyTimeline: React.FC<DailyTimelineProps> = ({
  medications,
  doseLogs,
  onToggleDose,
  seniorMode,
  onOpenScanner,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'taken'>('all');

  // Calculate total doses scheduled for today
  let totalDoseSlots = 0;
  let takenDoseSlots = 0;

  medications.forEach((med) => {
    med.timeOfDay.forEach((slot) => {
      totalDoseSlots++;
      const isTaken = doseLogs.some(
        (log) => log.medicationId === med.id && log.timeSlot === slot && log.taken
      );
      if (isTaken) takenDoseSlots++;
    });
  });

  const completionPct = totalDoseSlots > 0 ? Math.round((takenDoseSlots / totalDoseSlots) * 100) : 100;

  const handleReadSlot = (slotLabel: string, meds: Medication[]) => {
    const medNames = meds.map((m) => `${m.brandName}, which ${m.purposePlain.toLowerCase()} ${m.instructionsPlain}`).join('. ');
    const text = `Here is your ${slotLabel} schedule. You have ${meds.length} medication${meds.length > 1 ? 's' : ''}: ${medNames}`;
    speakText(text);
  };

  return (
    <div className="space-y-6">
      {/* Today's Adherence Banner */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          seniorMode
            ? 'bg-slate-900 text-white border-slate-700'
            : 'bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 text-white border-sky-700 shadow-md'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                4-Day Perfect Adherence Streak
              </span>
              <span className="text-xs text-sky-200">Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
            <h2 className={`font-black tracking-tight ${seniorMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
              Daily Medication Routine
            </h2>
            <p className="text-sm text-sky-100/80 mt-0.5">
              {takenDoseSlots} of {totalDoseSlots} prescribed doses taken today ({completionPct}%)
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-36 bg-sky-950/60 rounded-full h-3.5 border border-sky-600/40 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <span className="text-lg font-black text-emerald-300">{completionPct}%</span>
          </div>
        </div>
      </div>

      {/* Filter and Listen All Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filter:</span>
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Doses ({totalDoseSlots})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                filter === 'pending' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({totalDoseSlots - takenDoseSlots})
            </button>
            <button
              onClick={() => setFilter('taken')}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                filter === 'taken' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({takenDoseSlots})
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            const morningMeds = medications.filter((m) => m.timeOfDay.includes('morning'));
            const eveningMeds = medications.filter((m) => m.timeOfDay.includes('evening'));
            const bedtimeMeds = medications.filter((m) => m.timeOfDay.includes('bedtime'));
            const summary = `Today you take ${morningMeds.map((m) => m.brandName).join(' and ')} in the morning, ${eveningMeds.map((m) => m.brandName).join(' and ')} with dinner, and ${bedtimeMeds.map((m) => m.brandName).join(' and ')} at bedtime.`;
            speakText(summary);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold hover:bg-sky-100 transition cursor-pointer"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Read Full Day Summary Aloud</span>
        </button>
      </div>

      {/* Time Slot Sections */}
      <div className="space-y-6">
        {TIME_SLOTS.map((slot) => {
          const SlotIcon = slot.icon;
          // Find medications for this slot
          const medsInSlot = medications.filter((m) => m.timeOfDay.includes(slot.id));

          // Filter according to user preference
          const filteredMeds = medsInSlot.filter((m) => {
            const isTaken = doseLogs.some(
              (log) => log.medicationId === m.id && log.timeSlot === slot.id && log.taken
            );
            if (filter === 'pending') return !isTaken;
            if (filter === 'taken') return isTaken;
            return true;
          });

          if (medsInSlot.length === 0 && filter !== 'all') {
            return null;
          }

          return (
            <div
              key={slot.id}
              className={`rounded-2xl border transition-all ${
                seniorMode ? 'border-slate-300 bg-white shadow-sm' : 'border-slate-200 bg-white shadow-xs'
              } overflow-hidden`}
            >
              {/* Slot Header */}
              <div className={`px-5 py-3.5 border-b flex flex-wrap items-center justify-between gap-2 ${slot.accentBg} ${slot.accentBorder}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-xs border border-slate-200">
                    <SlotIcon className={`w-5 h-5 ${slot.accentText}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-black text-slate-900 ${seniorMode ? 'text-lg' : 'text-base'}`}>
                        {slot.label}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-white text-slate-700 border border-slate-200">
                        {slot.timeWindow}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{slot.mealContext}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleReadSlot(slot.label, medsInSlot)}
                    className="inline-flex items-center justify-center gap-1.5 h-8 min-h-[32px] px-3 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    title="Read this slot aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>Listen</span>
                  </button>
                  <span className="text-xs font-bold text-slate-500">
                    {medsInSlot.length} pill{medsInSlot.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Slot Content: Medication Cards */}
              <div className="p-4 sm:p-5 space-y-3">
                {medsInSlot.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-sm">
                    No medications scheduled for {slot.label.toLowerCase()}.
                  </div>
                ) : filteredMeds.length === 0 ? (
                  <div className="py-4 text-center text-slate-400 text-xs italic">
                    All doses in this slot match your active filter.
                  </div>
                ) : (
                  filteredMeds.map((med) => {
                    const isTaken = doseLogs.some(
                      (log) => log.medicationId === med.id && log.timeSlot === slot.id && log.taken
                    );
                    const logEntry = doseLogs.find(
                      (log) => log.medicationId === med.id && log.timeSlot === slot.id && log.taken
                    );

                    return (
                      <div
                        key={`${slot.id}-${med.id}`}
                        className={`p-4 rounded-xl border transition-all ${
                          isTaken
                            ? 'bg-emerald-50/50 border-emerald-200 opacity-80'
                            : seniorMode
                            ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-200'
                            : 'bg-white border-slate-200 hover:border-sky-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Pill visual & Names */}
                          <div className="flex items-start sm:items-center gap-3.5">
                            <PillVisual medication={med} size={seniorMode ? 'lg' : 'md'} />
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className={`font-black text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
                                  {med.brandName}
                                </h4>
                                <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-700">
                                  {med.dosage}
                                </span>
                                <span className="text-xs text-slate-500">
                                  ({med.genericName})
                                </span>
                              </div>

                              {/* Plain Language Purpose */}
                              <p className={`text-sky-800 font-semibold mt-1 ${seniorMode ? 'text-base' : 'text-xs sm:text-sm'}`}>
                                💡 Purpose: {med.purposePlain}
                              </p>

                              {/* Plain Instructions */}
                              <p className={`text-slate-700 mt-0.5 ${seniorMode ? 'text-base font-medium' : 'text-xs'}`}>
                                👉 {med.instructionsPlain}
                              </p>

                              {/* Food / Safety tags */}
                              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                {med.foodInstruction === 'with_food' && (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                                    🍽️ Take with meal
                                  </span>
                                )}
                                {med.foodInstruction === 'plenty_water' && (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-100 text-sky-800 flex items-center gap-1">
                                    💧 Full glass water
                                  </span>
                                )}
                                {med.foodInstruction === 'empty_stomach' && (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 flex items-center gap-1">
                                    ⏱️ Empty stomach
                                  </span>
                                )}
                                {med.foodInstruction === 'no_grapefruit' && (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                                    🚫 No Grapefruit
                                  </span>
                                )}
                                {med.refillDaysLeft <= 7 && (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 flex items-center gap-1">
                                    ⚠️ Refill soon ({med.refillDaysLeft}d left)
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action controls: Listen & Toggle */}
                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            <button
                              onClick={() => speakText(`${med.brandName} ${med.dosage}. ${med.instructionsPlain}. Remember: ${med.purposePlain}`)}
                              className="inline-flex items-center justify-center h-10 w-10 min-h-[40px] min-w-[40px] rounded-xl border border-slate-200 text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                              title="Listen to this pill instructions"
                              aria-label={`Listen to instructions for ${med.brandName}`}
                            >
                              <Volume2 className="w-4 h-4 shrink-0" />
                            </button>

                            <button
                              onClick={() => onToggleDose(med.id, slot.id)}
                              className={`inline-flex items-center justify-center gap-2 h-10 min-h-[40px] px-4 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                                isTaken
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white focus-visible:ring-emerald-500'
                                  : seniorMode
                                  ? 'bg-slate-900 hover:bg-slate-800 text-amber-300 ring-2 ring-amber-400 focus-visible:ring-amber-400'
                                  : 'bg-sky-600 hover:bg-sky-700 text-white focus-visible:ring-sky-500'
                              }`}
                            >
                              {isTaken ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                                  <span>Taken {logEntry?.takenAt ? `at ${logEntry.takenAt}` : 'Today'}</span>
                                </>
                              ) : (
                                <>
                                  <Circle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                                  <span>Mark Taken</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Ingest / Scanner CTA card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Have a new prescription or bought an over-the-counter medicine?</h4>
            <p className="text-xs text-slate-600">Scan the bottle label to check for deadly interactions with Eleanor's Warfarin or Metformin.</p>
          </div>
        </div>
        <button
          onClick={onOpenScanner}
          className="inline-flex items-center justify-center h-10 min-h-[40px] px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-xs transition whitespace-nowrap cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
        >
          Open AI Bottle Scanner
        </button>
      </div>
    </div>
  );
};
