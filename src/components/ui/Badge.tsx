import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const variants = {
  default: 'bg-neutral-100 text-neutral-700',
  primary: 'bg-primary-100 text-primary-700',
  secondary: 'bg-secondary-100 text-secondary-700',
  success: 'bg-success-100 text-success-700',
  warning: 'bg-highlight-100 text-highlight-700',
  danger: 'bg-danger-100 text-danger-700',
  outline: 'bg-transparent border border-neutral-300 text-neutral-600',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  icon?: React.ReactNode;
  onRemove?: () => void;
  variant?: 'default' | 'primary' | 'secondary';
}

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, icon, onRemove, variant = 'default', children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-neutral-100 text-neutral-700 border-neutral-200',
      primary: 'bg-primary-50 text-primary-700 border-primary-200',
      secondary: 'bg-secondary-50 text-secondary-700 border-secondary-200',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {icon}
        {children}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1 hover:bg-neutral-200 rounded-full p-0.5 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </span>
    );
  }
);

Chip.displayName = 'Chip';
