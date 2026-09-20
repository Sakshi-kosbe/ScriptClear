import React, { useEffect } from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

export interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      onNavigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, onNavigate]);

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to ScriptClear."
      onNavigateHome={() => onNavigate('/')}
    >
      <LoginForm
        onSuccess={() => onNavigate('/dashboard')}
        onNavigateSignup={() => onNavigate('/signup')}
        onNavigateForgotPassword={() => onNavigate('/forgot-password')}
      />
    </AuthLayout>
  );
};
