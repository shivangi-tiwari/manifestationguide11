'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { PortableText } from '@/components/ui/PortableText'
import { clsx } from 'clsx'

interface FAQ {
  _id: string
  question: string
  answer: any[]
  order?: number
}

interface FaqAccordionProps {
  faqs: FAQ[]
}

export function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const sorted = [...faqs].sort((a, b) => (a.order || 0) - (b.order || 0))

  if (sorted.length === 0) return null

  return (
    <div className="mb-12">
      <h3 className="text-heading-lg font-display font-semibold text-foreground mb-6">
        Frequently Asked Questions
      </h3>
      <div className="max-w-3xl mx-auto space-y-4">
        {sorted.map((faq, index) => (
          <Card key={faq._id} variant="outlined" className="overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-brown focus:ring-inset"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-semibold text-foreground text-base pr-8">{faq.question}</span>
              <svg
                className={clsx('w-5 h-5 text-muted flex-shrink-0 transition-transform', openIndex === index && 'rotate-180')}
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
                <div className="prose max-w-none">
                  <PortableText value={faq.answer} />
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}