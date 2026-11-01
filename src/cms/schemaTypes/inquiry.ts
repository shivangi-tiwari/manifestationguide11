import { defineField, defineType } from 'sanity'

export const inquiry = defineType({
  name: 'inquiry',
  title: 'Inquiry',
  type: 'document',
  description: 'Submitted through the website. Update Status to track follow-up; inquiry data is read-only.',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', readOnly: true, validation: (r) => r.required() }),
    defineField({ name: 'email', title: 'Email', type: 'string', readOnly: true, validation: (r) => r.required().email() }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', readOnly: true }),
    defineField({ name: 'interest', title: 'Interest (Package or free text)', type: 'string', readOnly: true }),
    defineField({ name: 'message', title: 'Message', type: 'text', readOnly: true, validation: (r) => r.required() }),
    defineField({ name: 'preferredTiming', title: 'Preferred Timing', type: 'string', readOnly: true }),
    defineField({
      name: 'termsAccepted',
      title: 'Terms & Conditions Accepted',
      type: 'boolean',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Set to Replied after responding, then Closed when no further follow-up is needed.',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Replied', value: 'replied' },
          { title: 'Closed', value: 'closed' },
        ],
      },
      validation: (r) => r.required(),
      initialValue: 'new',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
    defineField({ name: 'source', title: 'Source', type: 'string', readOnly: true, initialValue: 'website' }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'email', status: 'status' },
    prepare({ title, subtitle, status }) {
      return { title, subtitle: `${subtitle} — ${status}` }
    },
  },
})