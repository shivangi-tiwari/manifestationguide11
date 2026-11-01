'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from './Button'
import { Input } from './Input'
import { Textarea } from './Textarea'
import { Checkbox } from './Checkbox'
import { submitInquiry } from '@/app/actions/inquiry'
import { inquirySchema, type InquiryFormData } from '@/lib/inquirySchema'

interface TurnstileOptions {
  sitekey: string
  theme: 'light'
  callback: (token: string) => void
  'expired-callback': () => void
  'error-callback': () => void
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileOptions) => string
  remove: (widgetId: string) => void
  reset: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

interface InquiryFormProps {
  turnstileSiteKey: string
  termsText?: string
  termsUrl?: string
}

function InquiryFormInner({
  turnstileSiteKey,
  termsText = 'I agree to the Terms and Conditions',
  termsUrl = '/terms',
}: InquiryFormProps) {
  const [formData, setFormData] = useState<Partial<InquiryFormData>>({
    name: '',
    email: '',
    message: '',
    terms: false,
    turnstileToken: '',
    honeypot: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [coachEmailSent, setCoachEmailSent] = useState<boolean | null>(null)
  const [visitorEmailSent, setVisitorEmailSent] = useState<boolean | null>(null)
  const turnstileContainerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  const validateField = useCallback(
    <Key extends keyof InquiryFormData,>(name: Key, value: InquiryFormData[Key]) => {
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
    },
    []
  )

  const handleChange = useCallback(
    <Key extends keyof InquiryFormData,>(name: Key, value: InquiryFormData[Key]) => {
      setFormData((prev) => ({ ...prev, [name]: value }))
      validateField(name, value)
    },
    [validateField]
  )

  const handleTurnstileVerify = useCallback((token: string) => {
    handleChange('turnstileToken', token)
  }, [handleChange])

  const handleTurnstileExpire = useCallback(() => {
    handleChange('turnstileToken', '')
  }, [handleChange])

  // Load and render Turnstile widget
  useEffect(() => {
    if (!turnstileSiteKey || !turnstileContainerRef.current) return

    let cancelled = false

    const renderWidget = () => {
      if (cancelled || !turnstileContainerRef.current || !window.turnstile) return
      turnstileContainerRef.current.innerHTML = ''
      widgetIdRef.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: turnstileSiteKey,
        theme: 'light',
        callback: handleTurnstileVerify,
        'expired-callback': handleTurnstileExpire,
        'error-callback': handleTurnstileExpire,
      })
    }

    const handleScriptError = () => {
      console.error('Cloudflare Turnstile failed to load.')
    }

    if (window.turnstile) {
      renderWidget()
    } else {
      let script = document.querySelector<HTMLScriptElement>(
        'script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]'
      )

      if (!script) {
        script = document.createElement('script')
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
        script.async = true
        script.defer = true
        document.head.appendChild(script)
      }

      script.addEventListener('load', renderWidget, { once: true })
      script.addEventListener('error', handleScriptError, { once: true })
    }

    return () => {
      cancelled = true
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [turnstileSiteKey, handleTurnstileVerify, handleTurnstileExpire])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitStatus('idle')
    setErrorMessage('')
    setCoachEmailSent(null)
    setVisitorEmailSent(null)

    const result = inquirySchema.safeParse(formData)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof InquiryFormData, string>> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof InquiryFormData] = err.message
        }
      })
      setErrors(fieldErrors)
      if (result.error.errors.some((err) => err.path[0] === 'turnstileToken' || err.path[0] === 'honeypot')) {
        setSubmitStatus('error')
        setErrorMessage('Unable to submit. Please complete verification and try again.')
      }
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
        setCoachEmailSent(response.coachEmailSent === true)
        setVisitorEmailSent(response.visitorEmailSent === true)
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          message: '',
          terms: false,
          turnstileToken: '',
          honeypot: '',
        })
        // Reset Turnstile widget after successful submit
        if (widgetIdRef.current !== null && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current)
        }
      } else {
        setSubmitStatus('error')
        setErrorMessage(response.message || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error('Submit error:', err)
      setSubmitStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === 'success') {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-accent/20 dark:bg-accent/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-accent-tertiary dark:text-accent-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-heading-xl font-display font-bold text-cream mb-2">Inquiry Submitted!</h3>
        <p className="text-cream max-w-md mx-auto">
          Thank you for reaching out. Your inquiry has been received, and we&apos;ll contact you when someone is available.
        </p>
        {visitorEmailSent === true && (
          <p className="mx-auto mt-3 max-w-md text-cream">
            A confirmation email with the YouTube playlists link was sent to the email address you entered.
          </p>
        )}
        {visitorEmailSent === false && (
          <p className="mx-auto mt-3 max-w-md text-cream" role="status">
            Your inquiry is saved, but the confirmation email could not be sent. Please check that your email address is correct or contact us directly.
          </p>
        )}
        {coachEmailSent === false && (
          <p className="mx-auto mt-3 max-w-md text-cream" role="status">
            Your inquiry is saved, but the notification email could not be sent. Please contact us using the email in the Connect section.
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="grid gap-6 md:grid-cols-2">
        <Input
          tone="olive"
          label="Full Name *"
          placeholder="Your name"
          value={formData.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
          autoComplete="name"
        />
        <Input
          tone="olive"
          label="Email Address *"
          type="email"
          placeholder="Your email address"
          value={formData.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          required
          autoComplete="email"
        />
      </div>

      <Textarea
        tone="olive"
        label="Your Message *"
        placeholder="Tell me about your goals, challenges, and what you hope to achieve..."
        value={formData.message || ''}
        onChange={(e) => handleChange('message', e.target.value)}
        error={errors.message}
        required
        rows={5}
      />

      <Checkbox
        tone="olive"
        label={termsText}
        description={
          <>
            By submitting this form, you agree to our{' '}
            <a href={termsUrl} className="inline-flex min-h-[44px] items-center py-2 text-cream underline hover:text-cream">
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

      <div ref={turnstileContainerRef} id="turnstile-container" className="turnstile-widget" />

      {submitStatus === 'error' && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" role="alert">
          <p className="text-red-700 dark:text-red-300">{errorMessage}</p>
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
      </Button>

      <p className="text-center text-sm text-cream">
        Your name and email will be used to respond to this inquiry.
      </p>
    </form>
  )
}

export function InquiryForm(props: InquiryFormProps) {
  return <InquiryFormInner {...props} />
}