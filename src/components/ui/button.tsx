'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-sans font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md',
        secondary:
          'bg-text text-white hover:bg-text/90',
        outline:
          'border border-border bg-transparent text-text hover:bg-bg-warm hover:border-text-muted',
        ghost:
          'bg-transparent text-text hover:bg-bg-warm',
        accent:
          'bg-accent text-white hover:bg-accent/90 shadow-sm',
        danger:
          'bg-error text-white hover:bg-error/90',
      },
      size: {
        sm: 'h-9 px-4 text-xs rounded-lg',
        md: 'h-11 px-6 text-sm rounded-xl',
        lg: 'h-13 px-8 text-base rounded-xl',
        xl: 'h-14 px-10 text-base rounded-2xl',
        icon: 'h-10 w-10 rounded-xl',
      },
      fullWidth: {
        true: 'w-full',
      },
      rounded: {
        true: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  fullWidth,
  rounded,
  isLoading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth, rounded }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>Please wait…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export { buttonVariants };
