'use server'

import { sanityWriteClient } from '@/lib/sanity/writeClient'
import { getMandatoryPlaylistUrl } from '@/lib/sanity/mandatoryPlaylist'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

async function sendCoachEmail(data: { name: string; email: string; phone?: string; message: string }, packageName: string) {
  const coachEmail = process.env.COACH_EMAIL || 'manifestationcoach55@gmail.com'
  const fromEmail = process.env.INQUIRY_FROM_EMAIL || 'onboarding@resend.dev'

  await resend.emails.send({
    from: `Manifestation Coach <${fromEmail}>`,
    to: coachEmail,
    subject: `New Inquiry: ${data.name} - ${packageName}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">New Coaching Inquiry</h2>
        <div style="background: #fafafa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
          <p><strong>Package:</strong> ${packageName}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
        <p style="color: #666; font-size: 14px;">Reply directly to this email to respond to the client.</p>
      </div>
    `,
    replyTo: data.email,
  })
}

async function sendVisitorAutoReply(data: { name: string; email: string }, playlistUrl?: string) {
  const fromEmail = process.env.INQUIRY_FROM_EMAIL || 'onboarding@resend.dev'

  await resend.emails.send({
    from: `Manifestation Coach <${fromEmail}>`,
    to: data.email,
    subject: playlistUrl ? 'Thanks for reaching out! Here\'s your playlist' : 'Thanks for reaching out!',
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">Thanks for your inquiry, ${data.name}!</h2>
        <p>I've received your message. Thank you for getting in touch.</p>
        ${playlistUrl ? `
          <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 24px; border-radius: 12px; margin: 24px 0; text-align: center;">
            <p style="color: white; margin: 0 0 16px; font-size: 16px;">
              <strong>Before we start, please review this playlist:</strong>
            </p>
            <a href="${playlistUrl}" target="_blank"
               style="display: inline-block; background: white; color: #7c3aed; padding: 12px 24px; border-radius: 8px; font-weight: 600; text-decoration: none;">
              Watch the Playlist
            </a>
          </div>
        ` : ''}
      </div>
    `,
  })
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

  // Send emails (fire and forget - don't await)
  let playlistUrl: string | undefined
  try {
    playlistUrl = await getMandatoryPlaylistUrl()
  } catch (error) {
    console.error('Failed to load the auto-reply playlist from Site Settings.', error)
  }

  sendCoachEmail(data, 'General inquiry').catch(console.error)
  sendVisitorAutoReply(data, playlistUrl).catch(console.error)

  return { success: true, message: 'Inquiry submitted successfully' }
}