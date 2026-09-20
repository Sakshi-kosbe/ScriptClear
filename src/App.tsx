/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WorkspaceView, Medication, DoseLog, PatientProfile } from './types';
import { INITIAL_MEDICATIONS, INITIAL_PATIENT } from './data/mockMedications';
import { STORAGE_KEYS } from './constants/storageKeys';
import { useLocalStorage } from './hooks/useLocalStorage';
import { MedicationService } from './services/medicationService';
import { ToastProvider } from './components/ui/Toast';
import { LandingPage } from './pages/LandingPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { EmergencyCardModal } from './components/features/EmergencyCardModal';

export default function App() {
  const [appMode, setAppMode] = useState<'landing' | 'workspace'>('landing');
  const [workspaceInitialView, setWorkspaceInitialView] = useState<WorkspaceView>('dashboard');

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

  const [patient, setPatient] = useLocalStorage<PatientProfile>(
    'scriptclear_patient_profile',
    INITIAL_PATIENT
  );

  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  const handleOpenWorkspace = (view?: string) => {
    if (view && [
      'dashboard',
      'documents',
      'analysis',
      'routine',
      'cabinet',
      'sentinel',
      'missed',
      'settings',
    ].includes(view)) {
      setWorkspaceInitialView(view as WorkspaceView);
    }
    setAppMode('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetDemo = () => {
    if (window.confirm("Reset Eleanor Vance's medication regimen and document vault to clinical baseline?")) {
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
      setPatient(INITIAL_PATIENT);
      localStorage.removeItem('scriptclear_recent_documents');
      window.location.reload();
    }
  };

  return (
    <ToastProvider>
      {appMode === 'landing' ? (
        <LandingPage
          onOpenWorkspace={handleOpenWorkspace}
          seniorMode={seniorMode}
          onToggleSeniorMode={() => setSeniorMode(!seniorMode)}
          onOpenEmergencyCard={() => setIsEmergencyModalOpen(true)}
          onResetDemo={handleResetDemo}
        />
      ) : (
        <WorkspacePage
          initialView={workspaceInitialView}
          onBackToLanding={() => {
            setAppMode('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          seniorMode={seniorMode}
          onToggleSeniorMode={() => setSeniorMode(!seniorMode)}
          medications={medications}
          setMedications={setMedications}
          doseLogs={doseLogs}
          setDoseLogs={setDoseLogs}
          patient={patient}
          setPatient={setPatient}
          onResetDemo={handleResetDemo}
        />
      )}

      {/* Global Emergency Card Modal */}
      <EmergencyCardModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        patient={patient}
        medications={medications}
      />
    </ToastProvider>
  );
}
