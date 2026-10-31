'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { Button } from '@/components/ui/Button'
import { InstagramButton } from '@/components/ui/InstagramButton'

const navSections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'videos', label: 'Videos' },
  { id: 'stories', label: 'Stories' },
  { id: 'contact', label: 'Contact' },
] as const

type SectionId = typeof navSections[number]['id']

interface NavbarProps {
  siteName: string
  instagramHandle?: string
}

export function Navbar({ siteName, instagramHandle }: NavbarProps) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<SectionId>('home')
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sectionRefs = useRef<Record<SectionId, HTMLDivElement | null>>({} as Record<SectionId, HTMLDivElement | null>)

  // Scroll handler for navbar background
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // IntersectionObserver for scroll-spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id as SectionId
            if (navSections.some((s) => s.id === id)) {
              setActiveSection(id)
            }
          }
        })
      },
      {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0,
      }
    )

    observerRef.current = observer

    navSections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        sectionRefs.current[section.id] = element as HTMLDivElement
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  // Handle smooth scroll on link click
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isHomePage) {
      setIsMobileMenuOpen(false)
      return
    }

    e.preventDefault()
    const targetId = href.startsWith('#') ? href.slice(1) : href
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      // Close mobile menu
      setIsMobileMenuOpen(false)

      // Smooth scroll respecting prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      targetElement.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })

      // Update URL hash without jump
      history.replaceState(null, '', `#${targetId}`)
      setActiveSection(targetId as SectionId)
    }
  }, [isHomePage])

  // Handle initial hash on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1)
      if (hash && navSections.some((s) => s.id === hash)) {
        const targetElement = document.getElementById(hash)
        if (targetElement) {
          setTimeout(() => {
            targetElement.scrollIntoView({ behavior: 'auto', block: 'start' })
            setActiveSection(hash as SectionId)
          }, 0)
        }
      }
    }
  }, [])

  // Focus trap for mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-olive/95 backdrop-blur-sm shadow-sm border-b border-cream/20'
          : 'bg-olive'
      )}
      role="banner"
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex min-h-[44px] items-center gap-2 flex-shrink-0"
            aria-label={`${siteName} - Home`}
            onClick={(e) => handleNavClick(e as React.MouseEvent<HTMLAnchorElement>, '#home')}
          >
            <span className="text-xl font-display font-bold text-cream">
              {siteName}
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navSections.map((section) => (
              <Link
                key={section.id}
                href={isHomePage ? `#${section.id}` : `/#${section.id}`}
                className={clsx(
                  'inline-flex min-h-[44px] items-center text-sm font-medium transition-colors relative',
                  activeSection === section.id
                    ? 'text-cream aria-current'
                    : 'text-cream/85 hover:text-cream'
                )}
                aria-current={activeSection === section.id ? 'location' : undefined}
                onClick={(e) => handleNavClick(e, `#${section.id}`)}
              >
                {section.label}
                {activeSection === section.id && (
                  <span
                    className="absolute bottom-[-8px] left-0 right-0 h-0.5 bg-cream"
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}

            <div className="hidden md:flex md:items-center md:gap-4 ml-4">
              {instagramHandle && (
                <InstagramButton handle={instagramHandle} label="" size="sm" variant="default" className="w-auto" />
              )}
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <a href={isHomePage ? '#contact' : '/#contact'} onClick={(e) => handleNavClick(e, '#contact')}>Book a session</a>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-cream hover:bg-cream/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={clsx(
            'md:hidden overflow-hidden transition-all duration-300',
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
          role="navigation"
          aria-label="Mobile menu"
        >
          <div className="py-4 space-y-2">
            {navSections.map((section) => (
              <Link
                key={section.id}
                href={isHomePage ? `#${section.id}` : `/#${section.id}`}
                className={clsx(
                  'block px-4 py-3 rounded-lg text-base font-medium transition-colors min-h-[44px] flex items-center',
                  activeSection === section.id
                    ? 'bg-cream/15 text-cream'
                    : 'text-cream/85 hover:bg-cream/10 hover:text-cream'
                )}
                aria-current={activeSection === section.id ? 'location' : undefined}
                onClick={(e) => handleNavClick(e, `#${section.id}`)}
              >
                {section.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-cream/20 flex flex-col gap-3">
              {instagramHandle && (
                <InstagramButton handle={instagramHandle} size="md" variant="default" className="w-full justify-center min-h-[44px]" />
              )}
              <Button asChild className="w-full min-h-[44px]" size="md">
                <a href={isHomePage ? '#contact' : '/#contact'} onClick={(e) => handleNavClick(e, '#contact')}>Book a session</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}