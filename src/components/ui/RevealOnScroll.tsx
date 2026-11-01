'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { clsx } from 'clsx'

interface RevealOnScrollProps {
  children: ReactNode
  className?: string
}

export function RevealOnScroll({ children, className }: RevealOnScrollProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!('IntersectionObserver' in window)) return

    element.classList.add('reveal-pending')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.remove('reveal-pending')
          element.classList.add('reveal-visible')
          observer.unobserve(element)
        }
      },
      { threshold: 0 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={elementRef} className={clsx('reveal-on-scroll', className)}>
      {children}
    </div>
  )
}
