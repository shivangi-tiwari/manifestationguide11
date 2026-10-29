'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { InstagramButton } from '@/components/ui/InstagramButton'
import { Button } from '@/components/ui/Button'
import { clsx } from 'clsx'

const navLinks = [
  { label: 'Packages', href: '/packages' },
  { label: 'Videos', href: '/videos' },
  { label: 'Success Stories', href: '/success-stories' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

export function Header({ siteName, instagramHandle }: { siteName: string; instagramHandle?: string }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-sm shadow-sm border-b border-border'
          : 'bg-transparent'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label={`${siteName} - Home`}>
            <span className="text-xl font-display font-bold text-foreground">
              {siteName}
            </span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'text-sm font-medium transition-colors relative',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-accent-tertiary dark:text-accent-tertiary'
                    : 'text-muted dark:text-muted/80 hover:text-foreground dark:hover:text-foreground'
                )}
              >
                {link.label}
                {pathname === link.href || pathname.startsWith(link.href + '/') && (
                  <span className="absolute bottom-[-6px] left-0 right-0 h-0.5 bg-accent-tertiary dark:bg-accent-tertiary" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:gap-4">
            {instagramHandle && (
              <InstagramButton handle={instagramHandle} label="" size="sm" variant="default" className="w-auto" />
            )}
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/contact">Start Your Journey</Link>
            </Button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-muted dark:text-muted/80 hover:bg-muted/10 dark:hover:bg-muted/20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        <div
          id="mobile-menu"
          className={clsx('md:hidden overflow-hidden transition-all duration-300', isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')}
        >
          <div className="py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'block px-2 py-2 rounded-lg text-base font-medium transition-colors',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'bg-accent/20 dark:bg-accent/30 text-accent-tertiary dark:text-accent-tertiary'
                    : 'text-muted dark:text-muted/80 hover:bg-muted/10 dark:hover:bg-muted/20'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border flex flex-col gap-4">
              {instagramHandle && (
                <InstagramButton handle={instagramHandle} size="md" variant="default" className="w-full justify-center" />
              )}
              <Button asChild className="w-full" size="md">
                <Link href="/contact">Start Your Journey</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}