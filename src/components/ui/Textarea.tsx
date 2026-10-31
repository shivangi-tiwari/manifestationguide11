'use client'

import { TextareaHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  tone?: 'default' | 'olive'
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, tone = 'default', ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const inverse = tone === 'olive'

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className={clsx('block text-sm font-medium mb-1.5', inverse ? 'text-cream' : 'text-muted')}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={clsx(
            'w-full px-4 py-2.5 rounded-lg border transition-colors resize-y min-h-[100px]',
            inverse ? 'bg-olive text-cream placeholder:text-cream' : 'bg-background dark:bg-space-cadet-950 text-foreground dark:text-background placeholder:text-muted/50 dark:placeholder:text-muted/40',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-red-500 focus:ring-red-500'
              : inverse ? 'border-cream/60 hover:border-cream' : 'border-border dark:border-space-cadet-700 hover:border-muted/50 dark:hover:border-space-cadet-600',
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className={clsx('mt-1.5 text-sm', inverse ? 'text-cream' : 'text-red-500')} role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className={clsx('mt-1.5 text-sm', inverse ? 'text-cream' : 'text-muted/70 dark:text-muted/50')}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'