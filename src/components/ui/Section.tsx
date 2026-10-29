'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

type SectionVariant = 'cream' | 'sage' | 'butter' | 'default' | 'alternate' | 'dark' | 'accent'

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: SectionVariant
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = 'cream', size = 'lg', children, ...props }, ref) => {
    const variants: Record<SectionVariant, string> = {
      cream: 'bg-cream',
      sage: 'bg-sage',
      butter: 'bg-butter',
      default: 'bg-cream',
      alternate: 'bg-sage',
      dark: 'bg-olive text-cream',
      accent: 'bg-butter',
    }

    const sizes = {
      sm: 'py-12 md:py-16',
      md: 'py-16 md:py-20',
      lg: 'py-20 md:py-28',
      xl: 'py-28 md:py-36',
    }

    return (
      <section
        ref={ref}
        className={clsx(variants[variant], sizes[size], className)}
        {...props}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </section>
    )
  }
)

Section.displayName = 'Section'

export const SectionHeader = ({
  title,
  subtitle,
  align = 'center',
  className,
}: {
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  className?: string
}) => (
  <div className={clsx(`text-${align} mb-10 md:mb-14`, className)}>
    <h2 className="text-display-sm font-display font-semibold text-foreground tracking-tight text-balance">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-4 md:mt-6 text-body-lg text-muted max-w-3xl mx-auto text-balance">
        {subtitle}
      </p>
    )}
  </div>
)