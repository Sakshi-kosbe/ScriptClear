import React, { useEffect } from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { SignupForm } from '../components/auth/SignupForm';
import { useAuth } from '../hooks/useAuth';

export interface SignupPageProps {
  onNavigate: (path: string) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      onNavigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, onNavigate]);

  return (
    <AuthLayout
      title="Create your ScriptClear account"
      subtitle="Start your clinical-grade medication safety workspace."
      onNavigateHome={() => onNavigate('/')}
    >
      <SignupForm
        onSuccess={() => onNavigate('/dashboard')}
        onNavigateLogin={() => onNavigate('/login')}
      />
    </AuthLayout>
  );
};
