'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, asChild, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium rounded-card transition-all duration-200 ease-out-expo focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-brown text-accent-foreground hover:bg-brown/90 hover:shadow-card active:bg-brown/[0.8] focus:ring-brown',
      secondary: 'bg-sage text-olive hover:bg-sage/80 focus:ring-sage',
      outline: 'border-2 border-olive text-olive hover:bg-sage focus:ring-sage',
      ghost: 'text-muted hover:bg-sage focus:ring-sage',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm min-h-[44px]',
      md: 'px-6 py-3 text-base min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[48px]',
    }

    const Comp = asChild ? 'a' : 'button'

    return (
      <Comp
        // @ts-expect-error - Polymorphic ref for asChild pattern (button vs anchor)
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
      </Comp>
    )
  }
)

Button.displayName = 'Button'