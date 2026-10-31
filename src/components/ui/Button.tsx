'use client'

import { ButtonHTMLAttributes, cloneElement, forwardRef, isValidElement } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, asChild, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium rounded-card transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:shadow-card active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed motion-reduce:transition-none motion-reduce:hover:translate-y-0'

    const variants = {
      primary: 'bg-brown text-accent-foreground hover:bg-brown/90 active:bg-brown/[0.8] focus-visible:ring-brown',
      secondary: 'bg-sage text-olive hover:bg-sage/80 focus-visible:ring-sage',
      outline: 'border-2 border-olive text-olive hover:bg-sage focus-visible:ring-sage',
      ghost: 'text-muted hover:bg-sage focus-visible:ring-sage',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm min-h-[44px]',
      md: 'px-6 py-3 text-base min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[48px]',
    }

    if (asChild) {
      if (!isValidElement<{ className?: string }>(children)) {
        throw new Error('Button with asChild requires a single element child.')
      }

      return cloneElement(children, {
        className: clsx(base, variants[variant], sizes[size], className, children.props.className),
      })
    }

    return (
      <button
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'