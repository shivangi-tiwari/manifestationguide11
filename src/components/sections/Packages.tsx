'use client'

import { Section, SectionHeader } from '@/components/ui/Section'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { clsx } from 'clsx'

interface Package {
  _id: string
  name: string
  description: string
  price: number
  duration: string
  sessions: number
  features: string[]
  popular?: boolean
  ctaText?: string
}

interface PackagesProps {
  headline?: string
  subheadline?: string
  packages: Package[]
  onInquire?: (packageId: string) => void
}

export function Packages({ headline = 'Coaching Packages', subheadline, packages, onInquire }: PackagesProps) {
  return (
    <Section variant="alternate" size="lg" id="packages">
      <SectionHeader title={headline} subtitle={subheadline} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {packages.map((pkg, index) => (
          <Card
            key={pkg._id}
            variant={pkg.popular ? 'elevated' : 'outlined'}
            padding="lg"
            className={clsx('relative flex flex-col', pkg.popular && 'border-purple-500/50 shadow-purple-500/10')}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  ₹{pkg.price.toLocaleString('en-IN')}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">/ {pkg.duration}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{pkg.description}</p>
              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {pkg.sessions} 1:1 Zoom sessions included
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={pkg.popular ? 'primary' : 'outline'}
                onClick={() => onInquire?.(pkg._id)}
                asChild
              >
                <a href={`/contact?package=${pkg._id}`}>{pkg.ctaText || 'Select Package'}</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Section>
  )
}