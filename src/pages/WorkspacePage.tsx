import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  WorkspaceView,
  AnalyzedDocument,
  Medication,
  PatientProfile,
  DoseLog,
  TimeOfDay,
} from '../types';
import { AppSidebar } from '../components/layout/AppSidebar';
import { AppHeader } from '../components/layout/AppHeader';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { QuickActions } from '../components/dashboard/QuickActions';
import { RecentDocumentsTable } from '../components/documents/RecentDocumentsTable';
import { DocumentUploader } from '../components/documents/DocumentUploader';
import { AnalysisResultView } from '../components/analysis/AnalysisResultView';
import { DailyTimeline } from '../components/features/DailyTimeline';
import { MedicineCabinet } from '../components/features/MedicineCabinet';
import { ConflictSentinel } from '../components/features/ConflictSentinel';
import { MissedDoseAdvisor } from '../components/features/MissedDoseAdvisor';
import { EmergencyCardModal } from '../components/features/EmergencyCardModal';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { DocumentService } from '../services/documentService';
import { MedicationService } from '../services/medicationService';
import { useMedicationSafety } from '../hooks/useMedicationSafety';
import { useSpeech } from '../hooks/useSpeech';
import { useToast } from '../components/ui/Toast';
import {
  Files,
  FileCheck2,
  Calendar,
  Pill,
  ShieldAlert,
  HelpCircle,
  Settings,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export interface WorkspacePageProps {
  initialView?: WorkspaceView;
  onBackToLanding: () => void;
  seniorMode: boolean;
  onToggleSeniorMode: () => void;
  medications: Medication[];
  setMedications: React.Dispatch<React.SetStateAction<Medication[]>>;
  doseLogs: DoseLog[];
  setDoseLogs: React.Dispatch<React.SetStateAction<DoseLog[]>>;
  patient: PatientProfile;
  setPatient: React.Dispatch<React.SetStateAction<PatientProfile>>;
  onResetDemo: () => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({
  initialView = 'dashboard',
  onBackToLanding,
  seniorMode,
  onToggleSeniorMode,
  medications,
  setMedications,
  doseLogs,
  setDoseLogs,
  patient,
  setPatient,
  onResetDemo,
}) => {
  const [currentView, setCurrentView] = useState<WorkspaceView>(initialView);
  const [documents, setDocuments] = useState<AnalyzedDocument[]>(() =>
    DocumentService.getRecentDocuments()
  );
  const [selectedDocument, setSelectedDocument] = useState<AnalyzedDocument | null>(
    documents[0] || null
  );
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const { isSpeaking, stop } = useSpeech();
  const { toast } = useToast();
  const safetyResult = useMedicationSafety(medications, patient);

  // Adherence calculation
  const morningDone = doseLogs.some((l) => l.timeSlot === 'morning' && l.taken);
  const adherenceRate = Math.round(
    ((doseLogs.filter((l) => l.taken).length) / Math.max(1, medications.length)) * 100
  );

  const handleToggleDose = (medicationId: string, slot: TimeOfDay) => {
    setDoseLogs((prev) => MedicationService.toggleDoseLog(prev, medicationId, slot));
  };

  const handleDocumentAnalyzed = (newDoc: AnalyzedDocument) => {
    setDocuments((prev) => {
      const updated = [newDoc, ...prev.filter((d) => d.id !== newDoc.id)];
      DocumentService.saveDocuments(updated);
      return updated;
    });
    setSelectedDocument(newDoc);
    setCurrentView('analysis');
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => {
      const updated = prev.filter((d) => d.id !== docId);
      DocumentService.saveDocuments(updated);
      return updated;
    });
    if (selectedDocument?.id === docId) {
      setSelectedDocument(null);
    }
    toast({
      type: 'info',
      title: 'Document Deleted',
      description: 'The record was removed from your vault.',
    });
  };

  const handleSelectDocument = (doc: AnalyzedDocument) => {
    setSelectedDocument(doc);
    setCurrentView('analysis');
  };

  return (
    <div
      className={`min-h-screen flex transition-colors ${
        seniorMode
          ? 'bg-amber-50/40 text-slate-950 font-sans'
          : 'bg-slate-50 text-slate-900 font-sans dark:bg-slate-950 dark:text-slate-100'
      }`}
    >
      {/* Persistent SaaS Sidebar */}
      <AppSidebar
        currentView={currentView}
        onSelectView={setCurrentView}
        onBackToLanding={onBackToLanding}
        onOpenEmergencyCard={() => setIsEmergencyModalOpen(true)}
        patient={patient}
        conflictCount={safetyResult.conflicts.length}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          currentView={currentView}
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          seniorMode={seniorMode}
          onToggleSeniorMode={onToggleSeniorMode}
          patient={patient}
          isSpeaking={isSpeaking}
          onStopSpeech={stop}
          documentTitle={currentView === 'analysis' && selectedDocument ? selectedDocument.name : undefined}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
            >
              {/* VIEW 1: DASHBOARD */}
              {currentView === 'dashboard' && (
                <div className="space-y-6">
                  {/* Greeting banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Good morning, {patient.name.split(' ')[0]}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Here is the clinical intelligence status for your prescriptions and medical documents.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => setCurrentView('documents')}
                        className="flex items-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Upload Document</span>
                      </Button>
                    </div>
                  </div>

                  {/* 4 Key Metrics */}
                  <StatsOverview
                    documents={documents}
                    medications={medications}
                    safetyResult={safetyResult}
                    adherencePercentage={adherenceRate}
                    onNavigate={setCurrentView}
                  />

                  {/* Recent Documents + Quick Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          Recent Documents
                        </h3>
                        <button
                          onClick={() => setCurrentView('documents')}
                          className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                        >
                          View all ({documents.length})
                        </button>
                      </div>

                      <RecentDocumentsTable
                        documents={documents.slice(0, 4)}
                        onSelectDocument={handleSelectDocument}
                        onDeleteDocument={handleDeleteDocument}
                        onUploadClick={() => setCurrentView('documents')}
                      />
                    </div>

                    <div className="space-y-6">
                      <QuickActions
                        onNavigate={setCurrentView}
                        onOpenEmergencyCard={() => setIsEmergencyModalOpen(true)}
                      />
                      <RecentActivity
                        documents={documents}
                        onSelectDocument={handleSelectDocument}
                        onViewAllDocuments={() => setCurrentView('documents')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: DOCUMENTS */}
              {currentView === 'documents' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      Document & Prescription Vault
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Upload clinical discharge summaries, pharmacy bottle photos, or dosage instructions.
                    </p>
                  </div>

                  <DocumentUploader
                    onDocumentAnalyzed={handleDocumentAnalyzed}
                    existingMedications={medications}
                    patient={patient}
                  />

                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      All Stored Documents ({documents.length})
                    </h3>
                    <RecentDocumentsTable
                      documents={documents}
                      onSelectDocument={handleSelectDocument}
                      onDeleteDocument={handleDeleteDocument}
                      onUploadClick={() => setCurrentView('documents')}
                    />
                  </div>
                </div>
              )}

              {/* VIEW 3: ANALYSIS */}
              {currentView === 'analysis' && (
                <div>
                  {selectedDocument ? (
                    <AnalysisResultView
                      document={selectedDocument}
                      onBack={() => setCurrentView('documents')}
                    />
                  ) : (
                    <EmptyState
                      icon={FileCheck2}
                      title="No document selected for analysis"
                      description="Select a document from your vault or upload a new clinical record to view its plain-language analysis."
                      actionLabel="Choose Document"
                      onAction={() => setCurrentView('documents')}
                    />
                  )}
                </div>
              )}

              {/* VIEW 4: ROUTINE */}
              {currentView === 'routine' && (
                <div className="space-y-4">
                  <DailyTimeline
                    medications={medications}
                    doseLogs={doseLogs}
                    onToggleDose={handleToggleDose}
                    seniorMode={seniorMode}
                    onOpenScanner={() => setCurrentView('documents')}
                  />
                </div>
              )}

              {/* VIEW 5: CABINET */}
              {currentView === 'cabinet' && (
                <div className="space-y-4">
                  <MedicineCabinet
                    medications={medications}
                    onRemoveMedication={(id) =>
                      setMedications((prev) => prev.filter((m) => m.id !== id))
                    }
                    onOpenScanner={() => setCurrentView('documents')}
                    seniorMode={seniorMode}
                  />
                </div>
              )}

              {/* VIEW 6: SENTINEL */}
              {currentView === 'sentinel' && (
                <div className="space-y-4">
                  <ConflictSentinel
                    medications={medications}
                    patient={patient}
                    seniorMode={seniorMode}
                    onSelectPreset={() => setCurrentView('documents')}
                  />
                </div>
              )}

              {/* VIEW 7: MISSED DOSE */}
              {currentView === 'missed' && (
                <div className="space-y-4">
                  <MissedDoseAdvisor
                    medications={medications}
                    seniorMode={seniorMode}
                  />
                </div>
              )}

              {/* VIEW 8: SETTINGS */}
              {currentView === 'settings' && (
                <div className="max-w-2xl space-y-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Patient & Caregiver Profile
                    </h3>
                    <p className="text-xs text-slate-500">
                      Standard clinical baseline used for drug-allergy and contraindication screening.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-500 font-semibold block mb-1">Patient Name</label>
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 font-medium">
                          {patient.name}
                        </div>
                      </div>
                      <div>
                        <label className="text-slate-500 font-semibold block mb-1">Age</label>
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 font-medium">
                          {patient.age} years old
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-500 font-semibold block mb-1">Blood Type</label>
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 font-medium">
                          {patient.bloodType}
                        </div>
                      </div>
                      <div>
                        <label className="text-slate-500 font-semibold block mb-1">Documented Allergies</label>
                        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
                          {patient.knownAllergies.join(', ')}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-500 font-semibold block mb-1">Primary Cardiologist</label>
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 font-medium">
                          {patient.primaryDoctor}
                        </div>
                      </div>
                      <div>
                        <label className="text-slate-500 font-semibold block mb-1">Emergency Contact</label>
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 font-medium">
                          {patient.emergencyContactName} ({patient.emergencyContactRelation})
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Reset Demo Regimen</div>
                      <div className="text-[11px] text-slate-500">Restore baseline 4-medication patient state</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={onResetDemo}>
                      Reset Data
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Emergency Wallet Card Modal */}
      <EmergencyCardModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        patient={patient}
        medications={medications}
      />
    </div>
  );
};
