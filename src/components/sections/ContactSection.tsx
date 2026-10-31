'use client'

import { Section, SectionHeader } from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import { PackageCards } from './PackageCards'
import { HowItWorks } from './HowItWorks'
import { FaqAccordion } from './FaqAccordion'
import { InquiryForm } from '@/components/ui/InquiryForm'

interface ContactPackage {
  _id: string
  title: string
  price: number
}

interface FAQ {
  _id: string
  question: string
  answer: any[]
  order?: number
}

interface ContactSectionProps {
  packages: ContactPackage[]
  faqs: FAQ[]
  turnstileSiteKey: string
  instagramHandle?: string
  email?: string
  contactIntro?: string
}

export function ContactSection({ packages, faqs, turnstileSiteKey, instagramHandle, email, contactIntro }: ContactSectionProps) {
  return (
    <Section variant="sage" size="lg" id="contact" aria-labelledby="contact-heading">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div>
          <SectionHeader
            title="Contact"
            subtitle={contactIntro}
            align="left"
            number="05"
            label="Get in touch"
          />
          <PackageCards packages={packages} />
          <HowItWorks instagramHandle={instagramHandle} />
        </div>
        <div>
          <Card variant="outlined" padding="lg" className="bg-olive text-cream border-cream/25">
            <CardContent>
              <InquiryForm
                turnstileSiteKey={turnstileSiteKey}
              />
              <FaqAccordion faqs={faqs} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  )
}