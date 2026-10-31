'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

type SectionVariant = 'cream' | 'sage' | 'butter' | 'default' | 'alternate' | 'dark' | 'accent'

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: SectionVariant
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  waveTo?: 'cream' | 'sage' | 'butter'
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = 'cream', size = 'lg', waveTo, children, ...props }, ref) => {
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
      lg: 'py-[clamp(4rem,8vw,6rem)]',
      xl: 'py-28 md:py-36',
    }

    return (
      <section
        ref={ref}
        className={clsx(
          variants[variant],
          sizes[size],
          waveTo && 'relative',
          className
        )}
        {...props}
      >
        <RevealOnScroll className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </RevealOnScroll>
        {waveTo && (
          <svg
            aria-hidden="true"
            className={clsx(
              'pointer-events-none absolute inset-x-0 bottom-0 h-[clamp(2rem,5vw,4rem)] w-full',
              'stroke-olive/25',
              waveTo === 'cream' && 'fill-cream',
              waveTo === 'sage' && 'fill-sage',
              waveTo === 'butter' && 'fill-butter'
            )}
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
          >
            <path d="M0 32 C120 0 240 64 360 32 C480 0 600 64 720 32 C840 0 960 64 1080 32 C1200 0 1320 64 1440 32 L1440 80 L0 80 Z" strokeWidth="2" />
          </svg>
        )}
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
  number,
  label,
  id,
}: {
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  className?: string
  number?: string
  label?: string
  id?: string
}) => (
  <div className={clsx(`text-${align} mb-10 md:mb-14`, className)}>
    {label && <p className="mb-2 text-base font-semibold uppercase tracking-[0.16em] text-brown">{label}</p>}
    <div className={clsx('flex items-end gap-3 sm:gap-4', align === 'center' && 'justify-center', align === 'right' && 'justify-end')}>
      {number && <span aria-hidden="true" className="font-display text-[clamp(2.25rem,6vw,4.5rem)] leading-[0.8] text-brown/70">{number}</span>}
      <h2 id={id} className="text-[clamp(2.25rem,5vw,4rem)] font-display font-semibold leading-[0.95] text-foreground tracking-tight text-balance">
        {title}
      </h2>
    </div>
    {subtitle && (
      <p className={clsx('mt-4 text-body-lg text-muted max-w-3xl text-balance', align === 'center' ? 'mx-auto' : 'mx-0')}>
        {subtitle}
      </p>
    )}
  </div>
)