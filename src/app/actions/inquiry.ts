'use server'

import { headers } from 'next/headers'
import { sanityWriteClient } from '@/lib/sanity/writeClient'
import { mandatoryPlaylistUrl } from '@/lib/sanity/mandatoryPlaylist'
import { inquirySchema, type InquiryFormData } from '@/lib/inquirySchema'
import { Resend } from 'resend'

const RATE_LIMIT_WINDOW_MS = 60_000
const MAX_INQUIRIES_PER_WINDOW = 5
const inquiryAttempts = new Map<string, { startedAt: number; count: number }>()
let rateLimitCleanupCount = 0

type ResendMessage = Parameters<Resend['emails']['send']>[0]

function getClientIp(): string {
  const requestHeaders = headers()
  return (
    requestHeaders.get('x-nf-client-connection-ip')?.trim() ||
    requestHeaders.get('x-real-ip')?.trim() ||
    requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  )
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const attempt = inquiryAttempts.get(ip)

  if (!attempt || now - attempt.startedAt >= RATE_LIMIT_WINDOW_MS) {
    inquiryAttempts.set(ip, { startedAt: now, count: 1 })
  } else if (attempt.count >= MAX_INQUIRIES_PER_WINDOW) {
    return true
  } else {
    attempt.count += 1
  }

  rateLimitCleanupCount += 1
  if (rateLimitCleanupCount >= 100) {
    for (const [storedIp, storedAttempt] of inquiryAttempts) {
      if (now - storedAttempt.startedAt >= RATE_LIMIT_WINDOW_MS) {
        inquiryAttempts.delete(storedIp)
      }
    }
    rateLimitCleanupCount = 0
  }

  return false
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const replacements: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return replacements[character]
  })
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) {
    console.error('Cannot verify an inquiry: TURNSTILE_SECRET_KEY is not configured.')
    return false
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: secretKey, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(10_000),
    })

    if (!response.ok) {
      console.error(`Turnstile verification returned HTTP ${response.status}.`)
      return false
    }

    const result: unknown = await response.json()
    return typeof result === 'object' && result !== null && 'success' in result && result.success === true
  } catch (error) {
    console.error('Turnstile verification could not be completed.', error)
    return false
  }
}

async function sendEmail(message: ResendMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured.')
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send(message)
  if (error) {
    throw new Error(`Resend rejected the email: ${error.message}`)
  }
}

async function sendCoachEmail(data: InquiryFormData): Promise<void> {
  const recipient = process.env.INQUIRY_TO_EMAIL
  const fromEmail = process.env.INQUIRY_FROM_EMAIL
  if (!recipient) throw new Error('INQUIRY_TO_EMAIL is not configured.')
  if (!fromEmail) throw new Error('INQUIRY_FROM_EMAIL is not configured.')

  const safeName = escapeHtml(data.name)
  const safeEmail = escapeHtml(data.email)
  const safeMessage = escapeHtml(data.message)
  const subjectName = data.name.replace(/[\r\n]+/g, ' ').slice(0, 100)

  await sendEmail({
    from: `Manifestation Coach <${fromEmail}>`,
    to: recipient,
    subject: `New Inquiry: ${subjectName}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>New Coaching Inquiry</h2>
        <div style="background: #fafafa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${safeMessage}</p>
        </div>
        <p>Reply directly to this email to respond to the client.</p>
      </div>
    `,
    replyTo: data.email,
  })
}

async function sendVisitorAcknowledgement(data: InquiryFormData): Promise<void> {
  const fromEmail = process.env.INQUIRY_FROM_EMAIL
  if (!fromEmail) throw new Error('INQUIRY_FROM_EMAIL is not configured.')

  const safeName = escapeHtml(data.name)
  const safePlaylistUrl = escapeHtml(mandatoryPlaylistUrl)

  await sendEmail({
    from: `Manifestation Coach <${fromEmail}>`,
    to: data.email,
    subject: 'Your inquiry has been received',
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thanks for your inquiry, ${safeName}!</h2>
        <p>Your message has been received. We'll contact you as soon as someone is available.</p>
        <p>In the meantime, you can explore the YouTube playlists here:</p>
        <p><a href="${safePlaylistUrl}">Browse the YouTube playlists</a></p>
      </div>
    `,
  })
}

function getFormString(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value : ''
}

export async function submitInquiry(formData: FormData) {
  const ip = getClientIp()
  if (isRateLimited(ip)) {
    return { success: false, message: 'Unable to submit right now. Please try again later.' }
  }

  const validation = inquirySchema.safeParse({
    name: getFormString(formData, 'name'),
    email: getFormString(formData, 'email'),
    message: getFormString(formData, 'message'),
    terms: getFormString(formData, 'terms') === 'true',
    turnstileToken: getFormString(formData, 'turnstileToken'),
    honeypot: getFormString(formData, 'honeypot'),
  })

  if (!validation.success) {
    return { success: false, message: 'Unable to submit. Please check the form and try again.' }
  }

  const data = validation.data
  if (!(await verifyTurnstile(data.turnstileToken, ip))) {
    return { success: false, message: 'Unable to submit. Please try again.' }
  }

  try {
    await sanityWriteClient.create({
      _type: 'inquiry',
      name: data.name,
      email: data.email,
      message: data.message,
      termsAccepted: true,
      status: 'new',
      createdAt: new Date().toISOString(),
      source: 'website',
    })
  } catch (error) {
    console.error('Failed to save the inquiry to Sanity.', error)
    return { success: false, message: 'Unable to submit right now. Please try again later.' }
  }

  const emailResults = await Promise.allSettled([
    sendCoachEmail(data),
    sendVisitorAcknowledgement(data),
  ])
  for (const result of emailResults) {
    if (result.status === 'rejected') {
      console.error('An inquiry email could not be sent after the inquiry was saved.', result.reason)
    }
  }

  return {
    success: true,
    message: 'Inquiry submitted successfully',
    coachEmailSent: emailResults[0].status === 'fulfilled',
    visitorEmailSent: emailResults[1].status === 'fulfilled',
  }
}
