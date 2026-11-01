import { z } from 'zod'

export const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Please enter a valid email address').max(254),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
  terms: z.boolean().refine((value) => value, 'You must accept the terms and conditions'),
  turnstileToken: z.string().min(1, 'Please complete the verification'),
  honeypot: z.string().max(0).optional(),
})

export type InquiryFormData = z.infer<typeof inquirySchema>
