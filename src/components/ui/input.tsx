'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text tracking-wide"
        >
          {label}
          {props.required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full h-12 px-4 rounded-xl border bg-white text-text text-sm',
          'transition-all duration-200',
          'placeholder:text-text-muted',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          error
            ? 'border-error focus:ring-error/20 focus:border-error'
            : 'border-border hover:border-text-muted',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-error font-medium flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-text-muted">{hint}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className,
  id,
  ...props
}: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text tracking-wide"
        >
          {label}
          {props.required && <span className="text-error ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          'w-full px-4 py-3 rounded-xl border bg-white text-text text-sm resize-none',
          'transition-all duration-200',
          'placeholder:text-text-muted',
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          error
            ? 'border-error focus:ring-error/20 focus:border-error'
            : 'border-border hover:border-text-muted',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-error font-medium">{error}</p>
      )}
    </div>
  );
}
