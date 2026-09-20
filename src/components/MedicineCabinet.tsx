import React, { useState } from 'react';
import {
  Pill,
  Search,
  Plus,
  Trash2,
  Volume2,
  AlertTriangle,
  FileText,
  Clock,
  Phone,
  Check,
  ShieldCheck,
  X,
} from 'lucide-react';
import { Medication } from '../types';
import { PillVisual } from './PillVisual';
import { speakText } from '../utils/speech';

interface MedicineCabinetProps {
  medications: Medication[];
  onRemoveMedication: (id: string) => void;
  onOpenScanner: () => void;
  seniorMode: boolean;
}

export const MedicineCabinet: React.FC<MedicineCabinetProps> = ({
  medications,
  onRemoveMedication,
  onOpenScanner,
  seniorMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);

  const filteredMeds = medications.filter(
    (m) =>
      m.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.purposePlain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Controls: Search & Add */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search active medicines, health conditions, or doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-slate-500 px-2.5 py-1.5 bg-slate-100 rounded-lg shrink-0">
            {medications.length} Prescriptions Active
          </span>
          <button
            onClick={onOpenScanner}
            className="inline-flex items-center justify-center gap-1.5 h-10 min-h-[40px] px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm shadow-xs transition cursor-pointer shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Scan / Ingest New</span>
          </button>
        </div>
      </div>

      {/* Grid of Medication Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeds.map((med) => {
          const refillPct = Math.round((med.remainingPills / med.totalPills) * 100);
          const isLowRefill = med.refillDaysLeft <= 10;

          return (
            <div
              key={med.id}
              className={`p-5 rounded-2xl border bg-white transition-all flex flex-col justify-between ${
                seniorMode ? 'border-slate-300 shadow-sm' : 'border-slate-200 hover:border-sky-300 hover:shadow-xs'
              }`}
            >
              <div>
                {/* Header: Visual + Names + Refill Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <PillVisual medication={med} size={seniorMode ? 'lg' : 'md'} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-black text-slate-900 ${seniorMode ? 'text-xl' : 'text-base'}`}>
                          {med.brandName}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-slate-100 text-slate-700 border border-slate-200">
                          {med.dosage}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{med.genericName}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      isLowRefill
                        ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {med.refillDaysLeft} days refill left
                  </span>
                </div>

                {/* Plain-Language Purpose */}
                <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 mb-3">
                  <p className="text-xs text-sky-950 font-medium leading-relaxed">
                    <strong className="text-sky-900 font-bold">Why you take it: </strong>
                    {med.purposePlain}
                  </p>
                  <p className="text-[11px] text-sky-700 mt-1">
                    Treats: <span className="font-semibold">{med.condition}</span>
                  </p>
                </div>

                {/* Plain Instructions */}
                <div className="mb-3 space-y-1 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Schedule:</strong> {med.instructionsPlain}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Rx #{med.rxNumber}</strong> • Prescribed by {med.prescribedBy}
                    </span>
                  </div>
                </div>

                {/* Food interactions badges */}
                {med.foodInteractions.length > 0 && (
                  <div className="mb-3 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Food Rules to Remember:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {med.foodInteractions.map((fw, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1"
                          title={fw.hazard}
                        >
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          {fw.item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={() =>
                    speakText(
                      `${med.brandName}, ${med.dosage}. Purpose: ${med.purposePlain}. Instructions: ${med.instructionsPlain}. Prescribed by ${med.prescribedBy}.`
                    )
                  }
                  className="inline-flex items-center justify-center gap-1.5 h-8 min-h-[32px] px-3 rounded-lg text-xs font-bold text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition cursor-pointer shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                >
                  <Volume2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Listen</span>
                </button>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setSelectedMed(med)}
                    className="inline-flex items-center justify-center h-8 min-h-[32px] px-3 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  >
                    Details & Pharmacy
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${med.brandName} from Eleanor's active cabinet?`)) {
                        onRemoveMedication(med.id);
                      }
                    }}
                    className="inline-flex items-center justify-center h-8 w-8 min-h-[32px] min-w-[32px] rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                    title="Remove from cabinet"
                    aria-label={`Remove ${med.brandName}`}
                  >
                    <Trash2 className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Pill Modal */}
      {selectedMed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8">
            <button
              onClick={() => setSelectedMed(null)}
              className="absolute right-5 top-5 inline-flex items-center justify-center h-8 w-8 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              aria-label="Close details"
            >
              <X className="w-5 h-5 shrink-0" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <PillVisual medication={selectedMed} size="lg" />
              <div>
                <h3 className="text-xl font-black text-slate-900">{selectedMed.brandName}</h3>
                <p className="text-sm text-slate-500">
                  {selectedMed.genericName} • {selectedMed.dosage}
                </p>
                <span className="text-xs px-2 py-0.5 rounded font-semibold bg-sky-100 text-sky-800 mt-1 inline-block">
                  {selectedMed.condition}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <h5 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-1">
                  Plain-Language Purpose
                </h5>
                <p className="text-slate-900 font-medium">{selectedMed.purposePlain}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <h5 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-1">
                  How to Take Correctly
                </h5>
                <p className="text-slate-900 font-medium">{selectedMed.instructionsPlain}</p>
              </div>

              {selectedMed.warnings.length > 0 && (
                <div>
                  <h5 className="font-bold text-xs text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Crucial Safety Cautions
                  </h5>
                  <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                    {selectedMed.warnings.map((w, idx) => (
                      <li key={idx} className="font-medium">
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedMed.foodInteractions.length > 0 && (
                <div>
                  <h5 className="font-bold text-xs text-amber-800 uppercase tracking-wider mb-2">
                    Dietary & Food Rules
                  </h5>
                  <div className="space-y-2">
                    {selectedMed.foodInteractions.map((fi, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs">
                        <strong className="text-amber-900 font-bold block">{fi.item}:</strong>
                        <span className="text-amber-800">{fi.hazard}</span>
                        <p className="text-amber-950 font-semibold mt-0.5">👉 {fi.recommendation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>Pharmacy: {selectedMed.pharmacyPhone}</span>
                <span>Rx: #{selectedMed.rxNumber}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() =>
                  speakText(
                    `Details for ${selectedMed.brandName}. ${selectedMed.purposePlain}. ${selectedMed.instructionsPlain}.`
                  )
                }
                className="flex-1 inline-flex items-center justify-center gap-2 h-10 min-h-[40px] px-4 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 font-bold text-xs sm:text-sm hover:bg-sky-100 transition cursor-pointer shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
              >
                <Volume2 className="w-4 h-4 shrink-0" />
                <span>Listen Aloud</span>
              </button>
              <button
                onClick={() => setSelectedMed(null)}
                className="flex-1 inline-flex items-center justify-center h-10 min-h-[40px] px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition cursor-pointer shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
