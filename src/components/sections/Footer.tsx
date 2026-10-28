'use client'

import { InstagramButton } from '@/components/ui/InstagramButton'
import { clsx } from 'clsx'

interface FooterProps {
  siteName: string
  tagline?: string
  instagramHandle?: string
  email?: string
  copyrightText?: string
  links?: Array<{ label: string; href: string }>
  policyPages?: Array<{ label: string; href: string }>
}

export function Footer({
  siteName,
  tagline = 'Manifest your dream life with proven techniques',
  instagramHandle,
  email = 'manifestationcoach55@gmail.com',
  copyrightText,
  links = [
    { label: 'Packages', href: '/packages' },
    { label: 'Videos', href: '/videos' },
    { label: 'Success Stories', href: '/success-stories' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
  policyPages = [
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Refund Policy', href: '/refund' },
  ],
}: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-950 dark:bg-black border-t border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              {siteName}
            </h3>
            <p className="text-gray-400 max-w-xs mb-6">{tagline}</p>
            {instagramHandle && (
              <InstagramButton handle={instagramHandle} variant="default" size="md" />
            )}
          </div>
          <nav>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav>
            <h4 className="font-semibold text-white mb-4">Policies</h4>
            <ul className="space-y-3">
              {policyPages.map((page) => (
                <li key={page.href}>
                  <a href={page.href} className="text-gray-400 hover:text-white transition-colors">
                    {page.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </li>
              <li>Online via Zoom</li>
              <li>Worldwide</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            {copyrightText || `© ${currentYear} ${siteName}. All rights reserved.`}
          </p>
          <p className="text-gray-500 text-sm">
            No refunds on coaching sessions. Results vary by individual.
          </p>
        </div>
      </div>
    </footer>
  )
}