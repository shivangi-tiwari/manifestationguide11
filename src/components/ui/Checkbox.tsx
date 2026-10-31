'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  description?: React.ReactNode
  error?: string
  tone?: 'default' | 'olive'
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, tone = 'default', ...props }, ref) => {
    const checkboxId = id || label.toLowerCase().replace(/\s+/g, '-')
    const inverse = tone === 'olive'

    return (
      <div className="w-full">
        <div className="flex items-start gap-3">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={clsx(
              clsx('mt-1 h-4 w-4 rounded text-accent', inverse ? 'border-cream bg-olive' : 'border-muted'),
              'focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background dark:focus:ring-offset-space-cadet-950',
              !inverse && 'dark:border-space-cadet-700 dark:bg-space-cadet-950',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className
            )}
            {...props}
          />
          <div className="flex-1">
            <label htmlFor={checkboxId} className={clsx('text-sm cursor-pointer', inverse ? 'text-cream' : 'text-muted')}>
              {label}
            </label>
            {description && (
              <p className={clsx('mt-0.5 text-sm', inverse ? 'text-cream' : 'text-muted/70 dark:text-muted/50')}>{description}</p>
            )}
            {error && (
              <p className={clsx('mt-0.5 text-sm', inverse ? 'text-cream' : 'text-red-500')}>{error}</p>
            )}
          </div>
        </div>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'