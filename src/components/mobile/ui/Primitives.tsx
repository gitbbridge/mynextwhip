import React from 'react';
import { Loader2 } from 'lucide-react';

// ============================================================================
// 1. BUTTON PRIMITIVE (Tap target >= 44px, disabled state with spinner)
// ============================================================================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-bold tracking-tight rounded-2xl transition-all duration-150 select-none focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 min-h-[44px]';

  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 focus:ring-indigo-500',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-900 focus:ring-slate-400',
    outline: 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 focus:ring-slate-400 shadow-2xs',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-200 focus:ring-rose-500',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 focus:ring-slate-300',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200 focus:ring-emerald-500',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2 min-h-[44px]',
    md: 'text-sm px-4 py-2.5 min-h-[48px]',
    lg: 'text-base px-5 py-3.5 min-h-[52px]',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
          <span>{children}</span>
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </span>
      )}
    </button>
  );
};

// ============================================================================
// 2. BADGE PRIMITIVE (Status variants + Format variants)
// ============================================================================
export interface BadgeProps {
  variant?:
    | 'active'
    | 'committed'
    | 'settled'
    | 'abandoned'
    | 'hold_authorized'
    | 'captured_performance'
    | 'captured_penalty'
    | 'released_void'
    | 'bin'
    | 'auction'
    | 'verified'
    | 'neutral';
  children: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  size = 'md',
  className = '',
  dot = false,
}) => {
  const styles: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    committed: 'bg-amber-50 text-amber-900 border-amber-200',
    settled: 'bg-slate-100 text-slate-700 border-slate-300',
    abandoned: 'bg-zinc-100 text-zinc-500 border-zinc-200',
    hold_authorized: 'bg-amber-50 text-amber-900 border-amber-300 font-bold',
    captured_performance: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold',
    captured_penalty: 'bg-rose-50 text-rose-800 border-rose-300 font-bold',
    released_void: 'bg-slate-100 text-slate-700 border-slate-300 font-medium',
    bin: 'bg-blue-50 text-blue-700 border-blue-200',
    auction: 'bg-purple-50 text-purple-700 border-purple-200',
    verified: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold',
    neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  const dotColors: Record<string, string> = {
    active: 'bg-emerald-500 animate-pulse',
    committed: 'bg-amber-500',
    settled: 'bg-slate-400',
    hold_authorized: 'bg-amber-500 animate-pulse',
    captured_performance: 'bg-emerald-500',
    captured_penalty: 'bg-rose-500',
    released_void: 'bg-slate-400',
  };

  const sizeStyles = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${styles[variant]} ${sizeStyles} ${className}`}
    >
      {dot && dotColors[variant] && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} shrink-0`} />
      )}
      <span>{children}</span>
    </span>
  );
};

// ============================================================================
// 3. CARD PRIMITIVE
// ============================================================================
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  interactive = false,
  padding = 'md',
  className = '',
  children,
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden ${
        interactive
          ? 'cursor-pointer active:scale-[0.99] transition-transform duration-100 hover:border-slate-300'
          : ''
      } ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================================================
// 4. INPUT PRIMITIVE (With validation error message & helper text)
// ============================================================================
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-bold text-slate-700 tracking-tight">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full min-h-[44px] py-2.5 px-3.5 rounded-xl border bg-slate-50/70 text-slate-900 text-sm font-medium transition-colors focus:bg-white focus:outline-none focus:ring-2 ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''} ${
            error
              ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
              : 'border-slate-300 focus:ring-indigo-100 focus:border-indigo-600'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 text-slate-400 pointer-events-none flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-rose-600 font-medium pl-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 pl-1">{helperText}</p>
      ) : null}
    </div>
  );
};

// ============================================================================
// 5. CHECKBOX ROW PRIMITIVE (>= 44px tap target, title, desc, price badge)
// ============================================================================
export interface CheckboxRowProps {
  id: string;
  title: string;
  description: string;
  price: number;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export const CheckboxRow: React.FC<CheckboxRowProps> = ({
  id,
  title,
  description,
  price,
  checked,
  onChange,
  icon,
  disabled = false,
}) => {
  return (
    <label
      htmlFor={id}
      className={`min-h-[52px] p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 cursor-pointer select-none ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      } ${
        checked
          ? 'bg-indigo-50/70 border-indigo-400 shadow-2xs'
          : 'bg-white border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start gap-3 flex-1">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 shrink-0"
        />
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 tracking-tight">
            {icon && <span className="text-indigo-600 shrink-0">{icon}</span>}
            <span>{title}</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">{description}</p>
        </div>
      </div>
      <div className="text-right shrink-0 pt-0.5">
        <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
          +${price}
        </span>
      </div>
    </label>
  );
};

// ============================================================================
// 6. SECTION HEADER PRIMITIVE
// ============================================================================
export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <div className={`flex items-start justify-between gap-2 mb-3 ${className}`}>
      <div>
        <h2 className="text-base font-black text-slate-950 font-heading tracking-tight leading-tight">
          {title}
        </h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

// ============================================================================
// 7. SKELETON LOADERS
// ============================================================================
export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 animate-pulse">
      <div className="w-full h-44 bg-slate-200 rounded-xl" />
      <div className="flex justify-between items-center pt-1">
        <div className="h-5 w-3/5 bg-slate-200 rounded-md" />
        <div className="h-5 w-1/4 bg-slate-200 rounded-md" />
      </div>
      <div className="h-3 w-1/2 bg-slate-100 rounded-md" />
      <div className="flex gap-2 pt-1">
        <div className="h-6 w-16 bg-slate-100 rounded-full" />
        <div className="h-6 w-20 bg-slate-100 rounded-full" />
      </div>
    </div>
  );
};

export const SkeletonDetail: React.FC = () => {
  return (
    <div className="space-y-4 p-4 animate-pulse">
      <div className="w-full h-56 bg-slate-200 rounded-2xl" />
      <div className="h-7 w-3/4 bg-slate-200 rounded-lg" />
      <div className="h-5 w-1/3 bg-slate-200 rounded-lg" />
      <div className="h-12 w-full bg-slate-100 rounded-xl" />
      <div className="h-28 w-full bg-slate-100 rounded-xl" />
    </div>
  );
};
