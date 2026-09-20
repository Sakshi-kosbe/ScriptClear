import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Medication, TimeOfDay, DoseLog, PatientProfile, TabType } from '../types';
import { INITIAL_MEDICATIONS, INITIAL_PATIENT } from '../data/mockMedications';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSpeech } from '../hooks/useSpeech';
import { useMedicationSafety } from '../hooks/useMedicationSafety';
import { MedicationService } from '../services/medicationService';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Skeleton } from '../components/ui/Skeleton';
import {
  HeroSection,
  WorkflowSection,
  FeaturesSection,
  AboutSection,
  EmergencyCardModal,
  HackathonJudgeGuideModal,
} from '../components/features';
import { Award, RotateCcw } from 'lucide-react';

// Lazy-loaded feature modules for code splitting and fast initial bundle
const DailyTimeline = lazy(() =>
  import('../components/features/DailyTimeline').then((m) => ({ default: m.DailyTimeline }))
);
const MedicineCabinet = lazy(() =>
  import('../components/features/MedicineCabinet').then((m) => ({ default: m.MedicineCabinet }))
);
const ConflictSentinel = lazy(() =>
  import('../components/features/ConflictSentinel').then((m) => ({ default: m.ConflictSentinel }))
);
const PrescriptionScanner = lazy(() =>
  import('../components/features/PrescriptionScanner').then((m) => ({ default: m.PrescriptionScanner }))
);
const MissedDoseAdvisor = lazy(() =>
  import('../components/features/MissedDoseAdvisor').then((m) => ({ default: m.MissedDoseAdvisor }))
);

export const DashboardPage: React.FC = () => {
  const [medications, setMedications] = useLocalStorage<Medication[]>(
    STORAGE_KEYS.MEDICATIONS,
    INITIAL_MEDICATIONS
  );

  const [doseLogs, setDoseLogs] = useLocalStorage<DoseLog[]>(
    STORAGE_KEYS.DOSE_LOGS,
    MedicationService.getInitialDoseLogs()
  );

  const [seniorMode, setSeniorMode] = useLocalStorage<boolean>(
    STORAGE_KEYS.SENIOR_MODE,
    false
  );

  const [patient] = useState<PatientProfile>(INITIAL_PATIENT);
  const [activeTab, setActiveTab] = useState<TabType>('schedule');
  const [isEmergencyCardOpen, setIsEmergencyCardOpen] = useState(false);
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const { isSpeaking, stop } = useSpeech();
  const safetyResult = useMedicationSafety(medications, patient);

  // Toggle dose taken / pending
  const handleToggleDose = (medicationId: string, slot: TimeOfDay) => {
    setDoseLogs((currentLogs) =>
      MedicationService.toggleDoseLog(currentLogs, medicationId, slot)
    );
  };

  // Add medication from scanner or custom entry
  const handleAddMedication = (newMed: Medication) => {
    setMedications((prev) => {
      const exists = prev.some((m) => m.id === newMed.id);
      if (exists) {
        return prev.map((m) => (m.id === newMed.id ? newMed : m));
      }
      return [newMed, ...prev];
    });
    setActiveTab('cabinet');
  };

  // Remove medication
  const handleRemoveMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  // Reset to default demo data
  const handleResetDemo = () => {
    if (window.confirm("Reset Eleanor's medication cabinet to standard 4-prescription baseline?")) {
      stop();
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

  // Preset selector helper from conflict lab or quick simulate
  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    setActiveTab('scanner');
  };

  const handleQuickSimulateConflict = () => {
    handleSelectPreset('preset-ibuprofen');
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        seniorMode
          ? 'bg-amber-50/40 text-slate-950 font-sans'
          : 'bg-slate-50 text-slate-900 font-sans dark:bg-slate-950 dark:text-slate-100'
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
        onOpenJudgeModal={() => setIsJudgeModalOpen(true)}
        conflictCount={safetyResult.conflicts.length}
        allergyCount={safetyResult.allergyAlerts.length}
        pillCount={medications.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Modern SaaS Hero Section */}
        <HeroSection
          medications={medications}
          doseLogs={doseLogs}
          safetyResult={safetyResult}
          seniorMode={seniorMode}
          onNavigateTab={setActiveTab}
          onOpenJudgeModal={() => setIsJudgeModalOpen(true)}
          onQuickSimulateConflict={handleQuickSimulateConflict}
        />

        {/* Tab Navigation Content with Smooth Fade Transitions & Code-Split Suspense */}
        <section aria-label="Active Medication Feature" className="pt-2">
          <Suspense
            fallback={
              <div className="space-y-4 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-72" />
                  </div>
                </div>
                <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
            }
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
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
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </section>

        {/* Interactive 3-Step Workflow Section */}
        <WorkflowSection onNavigateTab={setActiveTab} />

        {/* Comprehensive Features Section */}
        <FeaturesSection
          onNavigateTab={setActiveTab}
          onOpenEmergencyCard={() => setIsEmergencyCardOpen(true)}
          seniorMode={seniorMode}
          setSeniorMode={setSeniorMode}
        />

        {/* Clinical Beers Criteria & About Section */}
        <AboutSection
          patient={patient}
          onOpenJudgeModal={() => setIsJudgeModalOpen(true)}
        />
      </main>

      {/* Production Footer */}
      <Footer
        onNavigateTab={setActiveTab}
        onOpenEmergencyCard={() => setIsEmergencyCardOpen(true)}
        onOpenJudgeModal={() => setIsJudgeModalOpen(true)}
        onResetDemo={handleResetDemo}
      />

      {/* Floating Bottom Quick Action Bar for Hackathon Judges & Demos */}
      <aside
        aria-label="Evaluation Shortcuts"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-2xl border border-slate-700/80 flex items-center gap-3 text-xs"
      >
        <button
          onClick={() => setIsJudgeModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black hover:bg-amber-300 transition cursor-pointer shadow-xs"
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
      </aside>

      {/* Emergency Wallet Card Modal */}
      <EmergencyCardModal
        isOpen={isEmergencyCardOpen}
        onClose={() => setIsEmergencyCardOpen(false)}
        patient={patient}
        medications={medications}
      />

      {/* Hackathon Judge Guide Modal */}
      <HackathonJudgeGuideModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
        onRunRoutineDemo={() => setActiveTab('schedule')}
        onRunConflictDemo={() => {
          setActivePresetId('preset-ibuprofen');
          setActiveTab('scanner');
        }}
      />
    </div>
  );
};
