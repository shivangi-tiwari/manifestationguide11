'use client'

import { useState } from 'react'
import { Section, SectionHeader } from '@/components/ui/Section'
import { Card, CardContent } from '@/components/ui/Card'
import { PortableText } from '@/components/ui/PortableText'
import { clsx } from 'clsx'

interface FAQItem {
  _id: string
  question: string
  answer: any[]
  order?: number
  category?: string
}

interface FAQProps {
  headline?: string
  subheadline?: string
  faqs: FAQItem[]
}

export function FAQ({ headline = 'Frequently Asked Questions', subheadline, faqs }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <Section variant="default" size="lg" id="faq">
      <SectionHeader title={headline} subtitle={subheadline} />
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((faq, index) => (
            <Card key={faq._id} variant="outlined" className="overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="font-semibold text-gray-900 dark:text-white text-lg pr-8">{faq.question}</span>
                <svg
                  className={clsx('w-5 h-5 text-gray-400 flex-shrink-0 transition-transform', openIndex === index && 'rotate-180')}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <CardContent id={`faq-answer-${index}`} className="pt-0 pb-6 px-6 animate-slide-down">
                  <div className="prose dark:prose-invert max-w-none">
                    <PortableText value={faq.answer} />
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
      </div>
      <style jsx global>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slide-down 0.2s ease-out; }
      `}</style>
    </Section>
  )
}