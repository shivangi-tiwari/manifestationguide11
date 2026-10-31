'use server'

import { sanityWriteClient } from '@/lib/sanity/writeClient'

async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) return true // Skip verification if not configured

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: secretKey, response: token }),
    })
    const data = await res.json()
    return data.success === true
  } catch {
    return false
  }
}

export async function submitInquiry(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    message: formData.get('message') as string,
    terms: formData.get('terms') === 'true',
    turnstileToken: formData.get('turnstileToken') as string,
    honeypot: formData.get('honeypot') as string || '',
  }
  // Validate honeypot first (spam check)
  if (data.honeypot && data.honeypot.length > 0) {
    return { success: true } // Silently succeed for bots
  }

  // Verify Turnstile
  const turnstileValid = await verifyTurnstile(data.turnstileToken)
  if (!turnstileValid) {
    return { success: false, message: 'Verification failed. Please try again.' }
  }

  // Store in Sanity
  await sanityWriteClient.create({
    _type: 'inquiry',
    name: data.name,
    email: data.email,
    message: data.message,
    termsAccepted: true,
    status: 'new',
    submittedAt: new Date().toISOString(),
  })

  return { success: true, message: 'Inquiry submitted successfully' }
}