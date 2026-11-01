'use client'

const steps = [
  { number: 1, title: 'Send an inquiry or DM on Instagram' },
  { number: 2, title: 'She replies and agrees a time' },
  { number: 3, title: 'She shares payment details directly' },
  { number: 4, title: 'Session confirmed' },
]

export function HowItWorks() {
  return (
    <div className="mb-12">
      <h3 className="text-heading-lg font-display font-semibold text-foreground mb-6">
        How it works
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => (
          <div key={step.number} className="text-center">
            <div className="w-12 h-12 rounded-full bg-brown flex items-center justify-center mx-auto mb-3 text-cream font-bold text-lg">
              {step.number}
            </div>
            <p className="text-sm text-muted">{step.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}