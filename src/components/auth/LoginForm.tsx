import React, { useState } from 'react';
import { Mail, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { PasswordInput } from './PasswordInput';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export interface LoginFormProps {
  onSuccess: () => void;
  onNavigateSignup: () => void;
  onNavigateForgotPassword: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onNavigateSignup,
  onNavigateForgotPassword,
}) => {
  const { login, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Form field errors
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate on input or submit
  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

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
      const res = await login({
        email,
        password,
        rememberMe,
      });

      if (res.success) {
        onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick fill helper for evaluation and testing
  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setErrors({});
    clearError();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Global Auth Error Alert */}
      {authError && (
        <div
          role="alert"
          className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
          <span>{authError}</span>
        </div>
      )}

      {/* Email Input */}
      <div className="space-y-1.5">
        <label
          htmlFor="login-email"
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          Email address
        </label>
        <div className="relative rounded-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="login-email"
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
            aria-describedby={errors.email ? 'login-email-error' : undefined}
          />
        </div>
        {errors.email && (
          <p id="login-email-error" role="alert" className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Input */}
      <PasswordInput
        id="login-password"
        label="Password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          if (authError) clearError();
        }}
        disabled={isSubmitting}
        error={errors.password}
      />

      {/* Remember me & Forgot Password */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isSubmitting}
            className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-sky-600 focus:ring-sky-500 transition cursor-pointer"
          />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Remember me
          </span>
        </label>

        <button
          type="button"
          onClick={onNavigateForgotPassword}
          className="text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition cursor-pointer"
        >
          Forgot password?
        </button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        isLoading={isSubmitting}
        size="lg"
        className="w-full shadow-xs"
      >
        Sign In
      </Button>

      {/* Demo Credentials Quick Switcher */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-sky-500" />
            <span>Instant Demo Logins</span>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('sarah.vance@scriptclear.health')}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:border-sky-300 transition text-left cursor-pointer"
          >
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              Sarah Vance
            </div>
            <div className="text-[10px] text-slate-500">Caregiver Account</div>
          </button>
          <button
            type="button"
            onClick={() => handleQuickFill('marcus.vance@scriptclear.health')}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:border-sky-300 transition text-left cursor-pointer"
          >
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
              Dr. Marcus Vance
            </div>
            <div className="text-[10px] text-slate-500">Clinician Account</div>
          </button>
        </div>
      </div>

      {/* Navigate to Signup */}
      <div className="text-center pt-2">
        <p className="text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onNavigateSignup}
            className="font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition cursor-pointer"
          >
            Create an account
          </button>
        </p>
      </div>
    </form>
  );
};
