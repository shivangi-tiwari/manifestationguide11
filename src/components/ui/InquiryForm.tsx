'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Button } from './Button'
import { Input } from './Input'
import { Textarea } from './Textarea'
import { Checkbox } from './Checkbox'
import { submitInquiry } from '@/app/actions/inquiry'

const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').optional().or(z.literal('')),
  package: z.string().min(1, 'Please select a package'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
  turnstileToken: z.string().min(1, 'Please complete the verification'),
  honeypot: z.string().max(0, 'Spam detected').optional(),
})

type InquiryFormData = z.infer<typeof inquirySchema>

interface InquiryFormProps {
  packages: Array<{ _id: string; name: string; price: number }>
  turnstileSiteKey: string
  termsText?: string
  termsUrl?: string
}

function InquiryFormInner({
  packages,
  turnstileSiteKey,
  termsText = 'I agree to the Terms and Conditions',
  termsUrl = '/terms',
}: InquiryFormProps) {
  const [formData, setFormData] = useState<Partial<InquiryFormData>>({
    name: '',
    email: '',
    phone: '',
    package: '',
    message: '',
    terms: false,
    turnstileToken: '',
    honeypot: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const validateField = (name: keyof InquiryFormData, value: any) => {
    const fieldSchema = inquirySchema.shape[name]
    if (fieldSchema) {
      const result = fieldSchema.safeParse(value)
      if (!result.success) {
        setErrors((prev) => ({ ...prev, [name]: result.error.errors[0].message }))
      } else {
        setErrors((prev) => {
          const next = { ...prev }
          delete next[name]
          return next
        })
      }
    }
  }

  const handleChange = (name: keyof InquiryFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
    validateField(name, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitStatus('idle')
    setErrorMessage('')

    const result = inquirySchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof InquiryFormData, string>> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof InquiryFormData] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const formDataToSubmit = new FormData()
      Object.entries(result.data).forEach(([key, value]) => {
        formDataToSubmit.append(key, String(value))
      })
      const response = await submitInquiry(formDataToSubmit)
      if (response.success) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          package: '',
          message: '',
          terms: false,
          turnstileToken: '',
          honeypot: '',
        })
      } else {
        setSubmitStatus('error')
        setErrorMessage(response.message || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setSubmitStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTurnstileVerify = (token: string) => {
    handleChange('turnstileToken', token)
  }

  const handleTurnstileExpire = () => {
    handleChange('turnstileToken', '')
  }

  if (submitStatus === 'success') {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Inquiry Submitted!</h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Thank you for reaching out. I&apos;ll get back to you within 24 hours. Please check your email for a playlist to review before our session.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="Full Name *"
          placeholder="Your name"
          value={formData.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
          autoComplete="name"
        />
        <Input
          label="Email Address *"
          type="email"
          placeholder="you@example.com"
          value={formData.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          required
          autoComplete="email"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Input
          label="Phone Number (optional)"
          type="tel"
          placeholder="+91 XXXXX XXXXX"
          value={formData.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
          error={errors.phone}
          autoComplete="tel"
        />
        <div className="w-full">
          <label htmlFor="package" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Select Package *
          </label>
          <select
            id="package"
            name="package"
            value={formData.package || ''}
            onChange={(e) => handleChange('package', e.target.value)}
            className={clsx(
              'w-full px-4 py-2.5 rounded-lg border transition-colors',
              'bg-white dark:bg-gray-800',
              'text-gray-900 dark:text-white',
              'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
              errors.package
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            )}
            required
            aria-invalid={errors.package ? 'true' : 'false'}
          >
            <option value="">Choose a package...</option>
            {packages.map((pkg) => (
              <option key={pkg._id} value={pkg._id}>
                {pkg.name} - ₹{pkg.price.toLocaleString('en-IN')}
              </option>
            ))}
          </select>
          {errors.package && <p className="mt-1.5 text-sm text-red-500" role="alert">{errors.package}</p>}
        </div>
      </div>

      <Textarea
        label="Your Message *"
        placeholder="Tell me about your goals, challenges, and what you hope to achieve..."
        value={formData.message || ''}
        onChange={(e) => handleChange('message', e.target.value)}
        error={errors.message}
        required
        rows={5}
      />

      <Checkbox
        label={termsText}
        description={
          <>
            By submitting this form, you agree to our{' '}
            <a href={termsUrl} className="text-purple-600 dark:text-purple-400 underline hover:text-purple-700">
              Terms and Conditions
            </a>
            {' '}and acknowledge that all payments are non-refundable.
          </>
        }
        checked={formData.terms}
        onChange={(e) => handleChange('terms', e.target.checked)}
        error={errors.terms}
        required
      />

      <div className="hidden" aria-hidden="true">
        <Input
          name="honeypot"
          tabIndex={-1}
          autoComplete="off"
          value={formData.honeypot || ''}
          onChange={(e) => handleChange('honeypot', e.target.value)}
        />
      </div>

      <div id="turnstile-container"></div>

      {submitStatus === 'error' && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" role="alert">
          <p className="text-red-700 dark:text-red-300">{errorMessage}</p>
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
      </Button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        By submitting, you agree to receive a confirmation email with a playlist link to review before our session.
      </p>
    </form>
  )
}

import { clsx } from 'clsx'

export function InquiryForm(props: InquiryFormProps) {
  return <InquiryFormInner {...props} />
}