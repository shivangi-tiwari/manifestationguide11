import { Metadata } from 'next'
import { MainLayout } from '@/components/layout/MainLayout'
import { Section } from '@/components/ui/Section'
import { PortableText } from '@/components/ui/PortableText'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for manifestation coaching services.',
}

export default function PrivacyPage() {
  const privacyContent = [
    { _type: 'block', children: [{ _type: 'span', text: 'Last updated: January 2025' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '1. Information We Collect' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'We collect information you provide directly: name, email, phone number, inquiry details, and any information shared during coaching sessions.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '2. How We Use Your Information' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'To respond to inquiries and schedule sessions' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'To deliver coaching services and send resources' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'To send occasional updates (you can unsubscribe anytime)' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'To improve our services' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '3. Data Storage' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'Inquiry data is stored in Sanity CMS (sanity.io). Session notes are stored locally and securely. Payment information is not stored by us - payments are processed via GPay/UPI directly.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '4. Data Sharing' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'We do not sell, trade, or rent your personal information. We may share data with service providers (Sanity, Resend for email, Cloudflare Turnstile) who are bound by confidentiality.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '5. Cookies & Analytics' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'We use minimal cookies for functionality (Turnstile verification). No Google Analytics or tracking pixels unless you consent.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '6. Your Rights' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'You can request access, correction, or deletion of your data by emailing us.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '7. Data Retention' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'Inquiry data: 2 years. Session notes: duration of coaching relationship + 1 year. You can request deletion anytime.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '8. Security' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'We implement reasonable security measures. However, no internet transmission is 100% secure.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '9. Children\'s Privacy' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'Our services are not directed to children under 18. We do not knowingly collect data from minors.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: '10. Changes' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'We may update this policy. Changes posted here with updated date.' }] },
    { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Contact' }] },
    { _type: 'block', children: [{ _type: 'span', text: 'Questions? Email manifestationcoach55@gmail.com' }] },
  ]

  return (
    <MainLayout
      siteName="Manifestation Coach"
      tagline="Transform your reality"
      instagramHandle="manifestationcoach55"
      email="manifestationcoach55@gmail.com"
    >
      <Section variant="dark" size="xl" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-orange-900/50" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">Privacy Policy</h1>
        </div>
      </Section>

      <Section variant="default" size="lg">
        <div className="max-w-3xl mx-auto">
          <PortableText value={privacyContent} />
        </div>
      </Section>
    </MainLayout>
  )
}