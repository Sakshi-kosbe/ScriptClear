import React from 'react';
import { X, Printer, Phone, AlertTriangle, Heart, Shield, QrCode } from 'lucide-react';
import { Medication, PatientProfile } from '../types';

interface EmergencyCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  medications: Medication[];
}

export const EmergencyCardModal: React.FC<EmergencyCardModalProps> = ({
  isOpen,
  onClose,
  patient,
  medications,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Standardized EMS & Hospital Triage Card
            </span>
            <h3 className="text-xl font-black text-slate-900">Emergency Medical Wallet Card</h3>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Wallet Card</span>
          </button>
        </div>

        {/* The Printable Card itself */}
        <div className="border-2 border-slate-900 rounded-2xl p-5 bg-white space-y-4 shadow-sm relative">
          {/* Header Banner */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                EMERGENCY MEDICAL IDENTIFICATION
              </span>
              <h2 className="text-2xl font-black text-slate-900">{patient.name}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-700 mt-0.5">
                <span>Age: <strong>{patient.age}</strong></span>
                <span>•</span>
                <span>Blood Type: <strong className="text-rose-700">{patient.bloodType}</strong></span>
              </div>
            </div>

            <div className="w-14 h-14 border border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-slate-600 shadow-inner">
              <QrCode className="w-8 h-8" />
              <span className="text-[8px] font-mono font-bold mt-0.5">SCAN EHR</span>
            </div>
          </div>

          {/* Critical Allergies Highlight */}
          <div className="bg-rose-50 border-2 border-rose-400 p-3 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-rose-800 tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                Severe Allergies (DO NOT ADMINISTER):
              </span>
              <div className="flex flex-wrap gap-2 mt-1">
                {patient.knownAllergies.map((all, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-rose-600 text-white font-black text-xs rounded"
                  >
                    {all}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Current Active Prescriptions */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1.5">
              Current Active Medications & Regimen:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {medications.map((m) => (
                <div
                  key={m.id}
                  className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <strong className="text-slate-900 block font-bold">
                      {m.brandName} ({m.genericName})
                    </strong>
                    <span className="text-slate-500 text-[11px]">{m.dosage} • {m.timeOfDay.join(', ')}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600 px-1.5 py-0.5 bg-white rounded border border-slate-200">
                    {m.condition.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Contacts & Physician */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Primary Emergency Contact:
              </span>
              <p className="font-bold text-slate-900 mt-0.5">
                {patient.emergencyContactName} ({patient.emergencyContactRelation})
              </p>
              <p className="text-sky-700 font-mono font-bold flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3" />
                {patient.emergencyContactPhone}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Attending Physician:
              </span>
              <p className="font-bold text-slate-900 mt-0.5">{patient.primaryDoctor}</p>
              <p className="text-sky-700 font-mono font-bold flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3" />
                {patient.doctorPhone}
              </p>
            </div>
          </div>

          <div className="text-center pt-2 text-[10px] text-slate-400 border-t border-dashed border-slate-200">
            Keep folded in wallet behind driver's license or insurance card. Generated by ScriptClear.
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-xs text-slate-800 transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
