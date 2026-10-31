'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { clsx } from 'clsx'

interface PackageMinimal {
  _id: string
  title: string
  price: number
  currency?: string
  priceNote?: string
  shortDescription?: string
  featured?: boolean
  published?: boolean
}

interface PackageCardsProps {
  packages: PackageMinimal[]
}

export function PackageCards({ packages }: PackageCardsProps) {
  const publishedPackages = packages.filter((p) => p.published !== false)

  if (publishedPackages.length === 0) return null

  return (
    <div className="mb-12">
      <h3 className="text-heading-lg font-display font-semibold text-foreground mb-6">
        Coaching Packages
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {publishedPackages.map((pkg) => (
          <Card key={pkg._id} variant="outlined" padding="md" className="flex flex-col">
            <CardContent className="flex-1 flex flex-col">
              <h4 className="font-semibold text-foreground mb-2">{pkg.title}</h4>
              <div className="mb-4">
                <span className="text-2xl font-bold text-foreground">
                  {pkg.price > 0
                    ? `${pkg.currency || '₹'}${pkg.price.toLocaleString('en-IN')}`
                    : 'Price on enquiry'}
                </span>
                {pkg.priceNote && (
                  <span className="text-sm text-muted ml-2">{pkg.priceNote}</span>
                )}
              </div>
              {pkg.shortDescription && <p className="text-sm text-muted mb-4 flex-1">{pkg.shortDescription}</p>}
              <Button asChild variant="outline" className="w-full">
                <a href={`#contact?package=${pkg._id}`}>Enquire</a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}