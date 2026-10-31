import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sanityWriteClient } from '@/lib/sanity/writeClient'
import { Resend } from 'resend'

const inquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').optional().or(z.literal('')),
  package: z.string().optional().or(z.literal('')),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
  turnstileToken: z.string().min(1, 'Please complete the verification'),
  honeypot: z.string().max(0, 'Spam detected').optional(),
})

type InquiryData = z.infer<typeof inquirySchema>

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

async function sendCoachEmail(data: InquiryData, packageName: string) {
  const coachEmail = process.env.COACH_EMAIL || 'manifestationcoach55@gmail.com'

  await resend.emails.send({
    from: 'Manifestation Coach <noreply@manifestationcoach.in>',
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

async function sendVisitorAutoReply(data: InquiryData, playlistUrl: string) {
  await resend.emails.send({
    from: 'Manifestation Coach <noreply@manifestationcoach.in>',
    to: data.email,
    subject: 'Thanks for reaching out! Here\'s your playlist 🎵',
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">Thanks for your inquiry, ${data.name}!</h2>
        <p>I've received your message. Thank you for getting in touch.</p>

        <div style="background: linear-gradient(135deg, #7c3aed, #ec4899); padding: 24px; border-radius: 12px; margin: 24px 0; text-align: center;">
          <p style="color: white; margin: 0 0 16px; font-size: 16px;">
            <strong>Before we start, please review this playlist:</strong>
          </p>
          <a href="${playlistUrl}" target="_blank"
             style="display: inline-block; background: white; color: #7c3aed; padding: 12px 24px; border-radius: 8px; font-weight: 600; text-decoration: none;">
            Watch the Playlist
          </a>
        </div>

        <p style="color: #666;">This playlist covers the foundational concepts we'll work with during your sessions. Going through it beforehand helps us hit the ground running!</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />

        <p style="color: #666; font-size: 14px;">
          <strong>Important:</strong> All coaching sessions are conducted via Zoom. Payment is collected via GPay/UPI after we agree on a schedule. No refunds on completed sessions.
        </p>

        <p style="color: #999; font-size: 12px; margin-top: 24px;">
          Manifestation Coach | manifestationcoach55@gmail.com | @manifestationcoach55
        </p>
      </div>
    `,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate honeypot first (spam check)
    if (body.honeypot && body.honeypot.length > 0) {
      return NextResponse.json({ success: true }) // Silently succeed for bots
    }

    // Validate input
    const validation = inquirySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Validation failed', errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = validation.data

    // Verify Turnstile
    const turnstileValid = await verifyTurnstile(data.turnstileToken)
    if (!turnstileValid) {
      return NextResponse.json({ message: 'Verification failed. Please try again.' }, { status: 400 })
    }

    // Get package name for emails
    const packageDoc = data.package
      ? await sanityWriteClient.fetch(
          `*[_type == "package" && _id == $id][0]{title}`,
          { id: data.package }
        )
      : null
    const packageName = packageDoc?.title || 'General inquiry'

    // Store in Sanity
    await sanityWriteClient.create({
      _type: 'inquiry',
      name: data.name,
      email: data.email,
      ...(data.phone ? { phone: data.phone } : {}),
      ...(data.package ? { package: { _type: 'reference', _ref: data.package } } : {}),
      message: data.message,
      termsAccepted: true,
      status: 'new',
      submittedAt: new Date().toISOString(),
    })

    // Send emails (don't await - fire and forget)
    const playlistUrl = process.env.MANDATORY_PLAYLIST_URL || 'https://youtube.com/playlist?list=PLxxxxxx'

    sendCoachEmail(data, packageName).catch(console.error)
    sendVisitorAutoReply(data, playlistUrl).catch(console.error)

    return NextResponse.json({ success: true, message: 'Inquiry submitted successfully' })
  } catch (error) {
    console.error('Inquiry error:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}