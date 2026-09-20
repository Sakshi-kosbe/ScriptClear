import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'secondary'
    | 'danger'
    | 'destructive'
    | 'warning'
    | 'ghost'
    | 'outline'
    | 'amber';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon-xs' | 'icon-sm' | 'icon' | 'icon-lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-150 cursor-pointer select-none whitespace-nowrap shrink-0 ' +
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 ' +
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ' +
      'active:scale-[0.98] leading-none text-center';

    const variantStyles: Record<string, string> = {
      primary:
        'bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800 shadow-sm focus-visible:ring-sky-500 border border-transparent',
      secondary:
        'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 border border-slate-200 dark:border-slate-700 focus-visible:ring-slate-400 shadow-xs',
      danger:
        'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm focus-visible:ring-rose-500 border border-transparent',
      destructive:
        'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm focus-visible:ring-rose-500 border border-transparent',
      warning:
        'bg-amber-500 text-slate-950 hover:bg-amber-400 active:bg-amber-600 font-bold focus-visible:ring-amber-400 border border-transparent shadow-xs',
      amber:
        'bg-amber-400 text-slate-950 hover:bg-amber-300 active:bg-amber-500 font-black shadow-sm focus-visible:ring-amber-300 border border-transparent',
      ghost:
        'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 focus-visible:ring-slate-400 border border-transparent',
      outline:
        'border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700 focus-visible:ring-sky-400 shadow-xs',
    };

    const sizeStyles = {
      xs: 'h-8 min-h-[32px] text-xs px-2.5 gap-1.5 rounded-lg',
      sm: 'h-9 min-h-[36px] text-xs sm:text-sm px-3.5 gap-2 rounded-xl',
      md: 'h-10 min-h-[40px] text-sm px-4 gap-2 rounded-xl',
      lg: 'h-11 min-h-[44px] text-sm sm:text-base px-5 sm:px-6 gap-2.5 rounded-xl font-bold',
      'icon-xs': 'h-8 w-8 min-h-[32px] min-w-[32px] p-0 rounded-lg',
      'icon-sm': 'h-9 w-9 min-h-[36px] min-w-[36px] p-0 rounded-xl',
      icon: 'h-10 w-10 min-h-[40px] min-w-[40px] p-0 rounded-xl',
      'icon-lg': 'h-11 w-11 min-h-[44px] min-w-[44px] p-0 rounded-xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        ) : (
          leftIcon && (
            <span className="inline-flex shrink-0 items-center justify-center pointer-events-none">
              {leftIcon}
            </span>
          )
        )}
        {children}
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0 items-center justify-center pointer-events-none">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
