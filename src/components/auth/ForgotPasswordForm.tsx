import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

export interface ForgotPasswordFormProps {
  onNavigateLogin: () => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onNavigateLogin,
}) => {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await resetPassword(email.trim());
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="py-4 text-center space-y-4 animate-in fade-in">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Check your email
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Check your email for instructions to reset your password. If you do not see it in a few minutes, please check your spam folder.
          </p>
        </div>

        <div className="pt-2">
          <Button
            variant="outline"
            onClick={onNavigateLogin}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to sign in</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <label
          htmlFor="forgot-email"
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          Email address
        </label>
        <div className="relative rounded-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            disabled={isSubmitting}
            className={`w-full pl-9.5 pr-3 py-2.5 bg-white dark:bg-slate-900 border rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all ${
              error
                ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
            } disabled:opacity-50`}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'forgot-email-error' : undefined}
          />
        </div>
        {error && (
          <p id="forgot-email-error" role="alert" className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            {error}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending instructions...</span>
          </>
        ) : (
          <span>Send reset link</span>
        )}
      </Button>

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onNavigateLogin}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to sign in</span>
        </button>
      </div>
    </form>
  );
};
