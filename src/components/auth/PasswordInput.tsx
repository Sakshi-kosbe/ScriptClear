import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, helperText, id = 'password-input', className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <div className="flex items-center justify-between">
            <label
              htmlFor={id}
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              {label}
            </label>
          </div>
        )}

        <div className="relative rounded-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-4 h-4" />
          </div>

          <input
            {...props}
            ref={ref}
            id={id}
            type={showPassword ? 'text' : 'password'}
            className={`w-full pl-9.5 pr-10 py-2.5 bg-white dark:bg-slate-900 border rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 transition-all outline-none ${
              error
                ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-200 dark:border-slate-800 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20'
            } disabled:opacity-50 disabled:bg-slate-50 dark:disabled:bg-slate-800/50 ${className}`}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={0}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Eye className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>

        {error && (
          <p id={`${id}-error`} role="alert" className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p id={`${id}-helper`} className="text-[11px] text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
