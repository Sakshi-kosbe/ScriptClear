/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { WorkspaceView, Medication, DoseLog, PatientProfile } from './types';
import { INITIAL_MEDICATIONS, INITIAL_PATIENT } from './data/mockMedications';
import { STORAGE_KEYS } from './constants/storageKeys';
import { useLocalStorage } from './hooks/useLocalStorage';
import { MedicationService } from './services/medicationService';
import { ToastProvider, useToast } from './components/ui/Toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { EmergencyCardModal } from './components/features/EmergencyCardModal';

function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Normalize initial path
  const getInitialPath = (): string => {
    try {
      const p = window.location.pathname;
      if (!p || p === '/index.html' || p === '') return '/';
      return p;
    } catch {
      return '/';
    }
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);
  const [intendedRoute, setIntendedRoute] = useState<string | null>(null);

  const navigate = useCallback((path: string) => {
    try {
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
    } catch {
      // Safe fallback for restricted iframe contexts
    }
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen for browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      try {
        setCurrentPath(window.location.pathname || '/');
      } catch {
        setCurrentPath('/');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // App Persistent State
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

  // Handle Sign out
  const handleLogout = () => {
    toast({
      type: 'info',
      title: 'Signed Out',
      description: 'You have been signed out of ScriptClear.',
    });
    navigate('/login');
  };

  // Handle Reset Demo
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
      toast({
        type: 'success',
        title: 'Reset Complete',
        description: 'Clinical demo data has been restored to baseline.',
      });
      navigate('/dashboard');
    }
  };

  // Determine Workspace View from URL
  const getWorkspaceViewFromPath = (path: string): WorkspaceView => {
    const clean = path.replace('/', '');
    const validViews: WorkspaceView[] = [
      'dashboard',
      'documents',
      'analysis',
      'routine',
      'cabinet',
      'sentinel',
      'missed',
      'settings',
    ];
    if (validViews.includes(clean as WorkspaceView)) {
      return clean as WorkspaceView;
    }
    return 'dashboard';
  };

  // Check route matches
  const isWorkspaceRoute = [
    '/dashboard',
    '/documents',
    '/analysis',
    '/routine',
    '/cabinet',
    '/sentinel',
    '/missed',
    '/settings',
  ].some((r) => currentPath === r || currentPath.startsWith(`${r}/`));

  // Render based on current path
  return (
    <>
      {/* Route 1: Landing Page */}
      {currentPath === '/' && (
        <LandingPage
          onOpenWorkspace={(view) => {
            const target = view ? `/${view}` : '/dashboard';
            if (!isAuthenticated && !isLoading) {
              setIntendedRoute(target);
              navigate('/login');
            } else {
              navigate(target);
            }
          }}
          seniorMode={seniorMode}
          onToggleSeniorMode={() => setSeniorMode(!seniorMode)}
          onOpenEmergencyCard={() => setIsEmergencyModalOpen(true)}
          onResetDemo={handleResetDemo}
          onNavigateAuth={(mode) => navigate(mode === 'signup' ? '/signup' : '/login')}
        />
      )}

      {/* Route 2: Login Page */}
      {currentPath === '/login' && (
        <LoginPage
          onNavigate={(target) => {
            if (target === '/dashboard' && intendedRoute) {
              const dest = intendedRoute;
              setIntendedRoute(null);
              navigate(dest);
            } else {
              navigate(target);
            }
          }}
        />
      )}

      {/* Route 3: Signup Page */}
      {currentPath === '/signup' && (
        <SignupPage
          onNavigate={(target) => {
            if (target === '/dashboard' && intendedRoute) {
              const dest = intendedRoute;
              setIntendedRoute(null);
              navigate(dest);
            } else {
              navigate(target);
            }
          }}
        />
      )}

      {/* Route 4: Forgot Password Page */}
      {currentPath === '/forgot-password' && (
        <ForgotPasswordPage onNavigate={navigate} />
      )}

      {/* Route 5: Protected Workspace Routes (/dashboard, /documents, /analysis, etc.) */}
      {isWorkspaceRoute && (
        <ProtectedRoute
          onRedirectToLogin={() => {
            setIntendedRoute(currentPath);
            navigate('/login');
          }}
        >
          <WorkspacePage
            initialView={getWorkspaceViewFromPath(currentPath)}
            onBackToLanding={() => navigate('/')}
            seniorMode={seniorMode}
            onToggleSeniorMode={() => setSeniorMode(!seniorMode)}
            medications={medications}
            setMedications={setMedications}
            doseLogs={doseLogs}
            setDoseLogs={setDoseLogs}
            patient={patient}
            setPatient={setPatient}
            onResetDemo={handleResetDemo}
            onLogout={handleLogout}
            onViewChange={(view) => navigate(`/${view}`)}
          />
        </ProtectedRoute>
      )}

      {/* Fallback for unmatched routes */}
      {currentPath !== '/' &&
        currentPath !== '/login' &&
        currentPath !== '/signup' &&
        currentPath !== '/forgot-password' &&
        !isWorkspaceRoute && (
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">404</h1>
            <p className="text-sm text-slate-500 mb-6">The requested page could not be found.</p>
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs cursor-pointer hover:bg-sky-700 transition"
            >
              Return Home
            </button>
          </div>
        )}

      {/* Global Emergency Card Modal */}
      <EmergencyCardModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        patient={patient}
        medications={medications}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AuthProvider>
  );
}
