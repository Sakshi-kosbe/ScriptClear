import React, { useState } from 'react';
import { User as UserIcon, Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PasswordInput } from './PasswordInput';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export interface SignupFormProps {
  onSuccess: () => void;
  onNavigateLogin: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SignupForm: React.FC<SignupFormProps> = ({
  onSuccess,
  onNavigateLogin,
}) => {
  const { signup, error: authError, clearError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'caregiver' | 'clinician'>('caregiver');

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your full name.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Please enter your password.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (isSubmitting) return;

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signup({
        name,
        email,
        password,
        confirmPassword,
        role,
      });

      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 800);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="py-8 text-center space-y-3 animate-in fade-in">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Account created successfully!
        </h2>
        <p className="text-xs text-slate-500">
          Preparing your clinical safety workspace...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {authError && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
          <span>{authError}</span>
        </div>
      )}

      {/* Role Selection */}
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          I am registering as a
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole('caregiver')}
            className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
              role === 'caregiver'
                ? 'bg-sky-50 border-sky-500 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            Family Caregiver
          </button>
          <button
            type="button"
            onClick={() => setRole('clinician')}
            className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
              role === 'clinician'
                ? 'bg-sky-50 border-sky-500 text-sky-700 dark:bg-sky-950 dark:text-sky-300'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            Healthcare Clinician
          </button>
        </div>
      </div>

      {/* Full Name */}
      <div className="space-y-1.5">
        <label
          htmlFor="signup-name"
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          Full Name
        </label>
        <div className="relative rounded-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <UserIcon className="w-4 h-4" />
          </div>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            placeholder="Eleanor Vance"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              if (authError) clearError();
            }}
            disabled={isSubmitting}
            className={`w-full pl-9.5 pr-3 py-2.5 bg-white dark:bg-slate-900 border rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all ${
              errors.name
                ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
            } disabled:opacity-50`}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'signup-name-error' : undefined}
          />
        </div>
        {errors.name && (
          <p id="signup-name-error" role="alert" className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email Address */}
      <div className="space-y-1.5">
        <label
          htmlFor="signup-email"
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          Email address
        </label>
        <div className="relative rounded-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              if (authError) clearError();
            }}
            disabled={isSubmitting}
            className={`w-full pl-9.5 pr-3 py-2.5 bg-white dark:bg-slate-900 border rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all ${
              errors.email
                ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
            } disabled:opacity-50`}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'signup-email-error' : undefined}
          />
        </div>
        {errors.email && (
          <p id="signup-email-error" role="alert" className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password */}
      <PasswordInput
        id="signup-password"
        label="Password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          if (authError) clearError();
        }}
        disabled={isSubmitting}
        error={errors.password}
      />

      {/* Confirm Password */}
      <PasswordInput
        id="signup-confirm-password"
        label="Confirm Password"
        autoComplete="new-password"
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          if (authError) clearError();
        }}
        disabled={isSubmitting}
        error={errors.confirmPassword}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer mt-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Creating account...</span>
          </>
        ) : (
          <span>Create Account</span>
        )}
      </Button>

      {/* Navigate to Login */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateLogin}
            className="font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
};
