'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'alternate' | 'dark'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = 'default', size = 'lg', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-gray-950',
      alternate: 'bg-gray-50 dark:bg-gray-900',
      dark: 'bg-gray-900 dark:bg-black',
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
  <div className={clsx(`text-${align} mb-12 md:mb-16`, className)}>
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
        {subtitle}
      </p>
    )}
  </div>
)