import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Pill, Loader2 } from 'lucide-react';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  onRedirectToLogin: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  onRedirectToLogin,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      onRedirectToLogin();
    }
  }, [isLoading, isAuthenticated, onRedirectToLogin]);

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 space-y-4 font-sans"
      >
        <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center text-white shadow-md animate-pulse">
          <Pill className="w-6 h-6 -rotate-45" />
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
          <span>Verifying clinical credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
