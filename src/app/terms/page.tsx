import { Metadata } from 'next'
import { MainLayout } from '@/components/layout/MainLayout'
import { Section } from '@/components/ui/Section'
import { PortableText } from '@/components/ui/PortableText'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for manifestation coaching services.',
}

export default function TermsPage() {
  const termsContent = [
    { _type: 'block', children: [{ _type: 'span', text: 'Last updated: January 2025' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'By booking a coaching session or purchasing a package from Manifestation Coach ("we", "us", "our"), you agree to these Terms and Conditions ("Terms").' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '1. Services' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'We provide manifestation coaching services including 1:1 Zoom sessions, guided programs, and digital resources. All services are delivered online via Zoom unless otherwise agreed.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '2. Booking & Payment' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'Inquiries submitted through our website are free and carry no obligation. Payment is collected via GPay/UPI after we mutually agree on a schedule. Full payment is required before the first session begins.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '3. No Refund Policy' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'All coaching sessions and packages are non-refundable once purchased. This policy exists because our time is reserved exclusively for you, preventing us from booking other clients. By purchasing, you acknowledge and accept this policy.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '4. Rescheduling & Cancellations' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'Sessions can be rescheduled with at least 24 hours\' notice. Cancellations within 24 hours are considered completed sessions. No-shows forfeit the session.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '5. Results Disclaimer' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'Manifestation coaching provides tools, techniques, and guidance. Results vary by individual and depend on many factors including commitment, consistency, and personal circumstances. We make no guarantees of specific outcomes.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '6. Intellectual Property' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'All coaching materials, worksheets, recordings, and resources are our intellectual property. They are for your personal use only and may not be shared, reproduced, or distributed.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '7. Confidentiality' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'All sessions and shared information are strictly confidential. We will not disclose your personal details or session content without explicit permission.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '8. Limitation of Liability' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'Our liability is limited to the amount paid for the specific service. We are not liable for indirect, incidental, or consequential damages.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '9. Governing Law' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'These Terms are governed by the laws of India. Disputes will be resolved in the courts of [Your City], India.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '10. Changes to Terms' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'We may update these Terms at any time. Continued use of our services after changes constitutes acceptance.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Contact' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'Questions about these Terms? Email manifestationcoach55@gmail.com' }] },
  ]

  return (
    <MainLayout
      siteName="Manifestation Coach"
      tagline="Transform your reality"
      instagramHandle="manifestationcoach55"
      email="manifestationcoach55@gmail.com"
      youtubeChannelId="ManifestationGuide11"
    >
      <Section variant="dark" size="xl" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-orange-900/50" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">Terms & Conditions</h1>
        </div>
      </Section>

      <Section variant="default" size="lg">
        <div className="max-w-3xl mx-auto">
          <PortableText value={termsContent} />
        </div>
      </Section>
    </MainLayout>
  )
}