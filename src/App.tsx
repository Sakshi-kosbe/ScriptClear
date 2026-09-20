/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Medication, TimeOfDay, DoseLog, PatientProfile } from './types';
import { INITIAL_MEDICATIONS, INITIAL_PATIENT } from './data/mockMedications';
import { analyzeMedicationSafety } from './utils/conflictChecker';
import { subscribeSpeech, stopSpeech } from './utils/speech';
import { Header } from './components/Header';
import { DailyTimeline } from './components/DailyTimeline';
import { MedicineCabinet } from './components/MedicineCabinet';
import { ConflictSentinel } from './components/ConflictSentinel';
import { PrescriptionScanner } from './components/PrescriptionScanner';
import { MissedDoseAdvisor } from './components/MissedDoseAdvisor';
import { EmergencyCardModal } from './components/EmergencyCardModal';
import { HackathonJudgeGuideModal } from './components/HackathonJudgeGuideModal';
import { Award, RotateCcw, ShieldCheck, Heart } from 'lucide-react';

const STORAGE_KEY_MEDS = 'scriptclear_meds_v1';
const STORAGE_KEY_LOGS = 'scriptclear_logs_v1';
const STORAGE_KEY_SENIOR = 'scriptclear_senior_v1';

export default function App() {
  const [medications, setMedications] = useState<Medication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MEDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved medications', e);
    }
    return INITIAL_MEDICATIONS;
  });

  const [doseLogs, setDoseLogs] = useState<DoseLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved dose logs', e);
    }
    const today = new Date().toISOString().split('T')[0];
    return [
      {
        id: 'init-1',
        medicationId: 'med-lisinopril',
        date: today,
        timeSlot: 'morning',
        takenAt: '8:15 AM',
        taken: true,
      },
    ];
  });

  const [patient, setPatient] = useState<PatientProfile>(INITIAL_PATIENT);
  const [activeTab, setActiveTab] = useState<'schedule' | 'cabinet' | 'conflicts' | 'scanner' | 'missed'>('schedule');
  const [seniorMode, setSeniorMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_SENIOR) === 'true';
    } catch {
      return false;
    }
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isEmergencyCardOpen, setIsEmergencyCardOpen] = useState(false);
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MEDS, JSON.stringify(medications));
    } catch (e) {
      console.warn(e);
    }
  }, [medications]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(doseLogs));
    } catch (e) {
      console.warn(e);
    }
  }, [doseLogs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SENIOR, seniorMode ? 'true' : 'false');
    } catch (e) {
      console.warn(e);
    }
  }, [seniorMode]);

  // Subscribe to speech synthesis state
  useEffect(() => {
    const unsub = subscribeSpeech((state) => {
      setIsSpeaking(state.isSpeaking);
    });
    return () => unsub();
  }, []);

  // Calculate safety status
  const safetyResult = analyzeMedicationSafety(medications, patient);

  // Toggle dose taken/pending
  const handleToggleDose = (medicationId: string, slot: TimeOfDay) => {
    const today = new Date().toISOString().split('T')[0];
    const existingIndex = doseLogs.findIndex(
      (l) => l.medicationId === medicationId && l.timeSlot === slot && l.date === today
    );

    if (existingIndex >= 0) {
      const updated = [...doseLogs];
      updated[existingIndex] = {
        ...updated[existingIndex],
        taken: !updated[existingIndex].taken,
        takenAt: !updated[existingIndex].taken
          ? new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
          : undefined,
      };
      setDoseLogs(updated);
    } else {
      const newEntry: DoseLog = {
        id: `dose-${Date.now()}`,
        medicationId,
        date: today,
        timeSlot: slot,
        taken: true,
        takenAt: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setDoseLogs([...doseLogs, newEntry]);
    }
  };

  // Add medication from scanner or custom entry
  const handleAddMedication = (newMed: Medication) => {
    // Avoid duplicate IDs
    const exists = medications.some((m) => m.id === newMed.id);
    if (exists) {
      setMedications(medications.map((m) => (m.id === newMed.id ? newMed : m)));
    } else {
      setMedications([newMed, ...medications]);
    }
    // Switch to cabinet or conflicts to view the impact
    setActiveTab('cabinet');
  };

  // Remove medication
  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id));
  };

  // Reset to default demo data
  const handleResetDemo = () => {
    if (confirm('Reset Eleanor\'s medication cabinet to standard 4-prescription baseline?')) {
      stopSpeech();
      setMedications(INITIAL_MEDICATIONS);
      const today = new Date().toISOString().split('T')[0];
      setDoseLogs([
        {
          id: 'init-1',
          medicationId: 'med-lisinopril',
          date: today,
          timeSlot: 'morning',
          takenAt: '8:15 AM',
          taken: true,
        },
      ]);
      setActivePresetId(null);
    }
  };

  // Preset selector helper from conflict lab
  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    setActiveTab('scanner');
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        seniorMode ? 'bg-amber-50/30 text-slate-900 font-sans' : 'bg-slate-50 text-slate-900 font-sans'
      }`}
    >
      {/* Sticky Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        seniorMode={seniorMode}
        setSeniorMode={setSeniorMode}
        isSpeaking={isSpeaking}
        onOpenEmergencyCard={() => setIsEmergencyCardOpen(true)}
        conflictCount={safetyResult.conflicts.length}
        allergyCount={safetyResult.allergyAlerts.length}
        pillCount={medications.length}
      />

      {/* Main Content View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24">
        {activeTab === 'schedule' && (
          <DailyTimeline
            medications={medications}
            doseLogs={doseLogs}
            onToggleDose={handleToggleDose}
            seniorMode={seniorMode}
            onOpenScanner={() => setActiveTab('scanner')}
          />
        )}

        {activeTab === 'cabinet' && (
          <MedicineCabinet
            medications={medications}
            onRemoveMedication={handleRemoveMedication}
            onOpenScanner={() => setActiveTab('scanner')}
            seniorMode={seniorMode}
          />
        )}

        {activeTab === 'conflicts' && (
          <ConflictSentinel
            medications={medications}
            patient={patient}
            seniorMode={seniorMode}
            onSelectPreset={handleSelectPreset}
          />
        )}

        {activeTab === 'scanner' && (
          <PrescriptionScanner
            onAddMedication={handleAddMedication}
            existingMedications={medications}
            patient={patient}
            seniorMode={seniorMode}
            activePresetId={activePresetId}
            onClearActivePreset={() => setActivePresetId(null)}
          />
        )}

        {activeTab === 'missed' && (
          <MissedDoseAdvisor medications={medications} seniorMode={seniorMode} />
        )}
      </main>

      {/* Modals */}
      <EmergencyCardModal
        isOpen={isEmergencyCardOpen}
        onClose={() => setIsEmergencyCardOpen(false)}
        patient={patient}
        medications={medications}
      />

      <HackathonJudgeGuideModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
        onRunRoutineDemo={() => {
          setActiveTab('schedule');
        }}
        onRunConflictDemo={() => {
          setActivePresetId('preset-ibuprofen');
          setActiveTab('scanner');
        }}
      />

      {/* Floating Bottom Bar: Demo Reset & Judge Cheat Sheet */}
      <footer className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-xl border border-slate-700 flex items-center gap-3 text-xs">
        <button
          onClick={() => setIsJudgeModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black hover:bg-amber-300 transition cursor-pointer"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Judging Cheat Sheet</span>
        </button>

        <span className="text-slate-500">|</span>

        <button
          onClick={handleResetDemo}
          className="flex items-center gap-1 text-slate-300 hover:text-white transition cursor-pointer"
          title="Reset Eleanor's profile and initial 4 medications"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Demo Data</span>
        </button>
      </footer>
    </div>
  );
}
