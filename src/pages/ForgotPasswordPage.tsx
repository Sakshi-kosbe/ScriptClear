import React from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';

export interface ForgotPasswordPageProps {
  onNavigate: (path: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email address to receive secure instructions."
      onNavigateHome={() => onNavigate('/')}
    >
      <ForgotPasswordForm
        onNavigateLogin={() => onNavigate('/login')}
      />
    </AuthLayout>
  );
};
