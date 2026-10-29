'use client'

import { forwardRef, SVGAttributes } from 'react'
import { clsx } from 'clsx'

interface DoodleProps extends SVGAttributes<SVGSVGElement> {
  name: string
  className?: string
}

// Map of doodle names to their SVG content
const doodles: Record<string, React.ReactNode> = {
  hero: (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="100" cy="100" r="80" stroke="#CFE0D0" strokeWidth="2" fill="#CFE0D020" />
      <path d="M100 40 Q130 40 145 65 Q160 90 145 115 Q130 140 100 140 Q70 140 55 115 Q40 90 55 65 Q70 40 100 40" stroke="#5C6B4B" strokeWidth="2" fill="#CFE0D040" />
      <circle cx="100" cy="100" r="25" fill="#8A4B1F" />
      <path d="M100 85 L100 115" stroke="#FFF5D6" strokeWidth="3" strokeLinecap="round" />
      <path d="M85 100 L115 100" stroke="#FFF5D6" strokeWidth="3" strokeLinecap="round" />
      <circle cx="70" cy="70" r="8" fill="#FBD86B" />
      <circle cx="130" cy="70" r="8" fill="#FBD86B" />
      <circle cx="70" cy="130" r="8" fill="#FBD86B" />
      <circle cx="130" cy="130" r="8" fill="#FBD86B" />
    </svg>
  ),
  about: (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="100" cy="110" rx="70" ry="60" stroke="#CFE0D0" strokeWidth="2" fill="#CFE0D020" />
      <path d="M100 70 Q120 70 130 90 Q140 110 130 130 Q120 150 100 150 Q80 150 70 130 Q60 110 70 90 Q80 70 100 70" stroke="#5C6B4B" strokeWidth="2" fill="#CFE0D040" />
      <ellipse cx="100" cy="100" rx="20" ry="25" fill="#8A4B1F" />
      <ellipse cx="80" cy="95" rx="4" ry="6" fill="#FFF5D6" />
      <ellipse cx="120" cy="95" rx="4" ry="6" fill="#FFF5D6" />
      <path d="M85 120 Q100 135 115 120" stroke="#FFF5D6" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M50 50 Q60 60 55 70 Q50 80 50 90" stroke="#FBD86B" strokeWidth="2" fill="none" />
      <path d="M150 50 Q140 60 145 70 Q150 80 150 90" stroke="#FBD86B" strokeWidth="2" fill="none" />
      <path d="M40 110 Q35 105 30 100 Q25 95 20 90" stroke="#FBD86B" strokeWidth="2" fill="none" />
      <path d="M160 110 Q165 105 170 100 Q175 95 180 90" stroke="#FBD86B" strokeWidth="2" fill="none" />
    </svg>
  ),
  videos: (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="30" y="50" width="140" height="100" rx="15" stroke="#CFE0D0" strokeWidth="2" fill="#CFE0D020" />
      <polygon points="60,75 110,100 60,125" fill="#8A4B1F" />
      <rect x="30" y="50" width="140" height="100" rx="15" stroke="#5C6B4B" strokeWidth="1.5" fill="none" />
      <circle cx="170" cy="70" r="20" fill="#FBD86B" />
      <path d="M162 65 L168 70 L162 75" stroke="#8A4B1F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="30" cy="130" r="15" fill="#FBD86B40" />
      <circle cx="170" cy="130" r="15" fill="#FBD86B40" />
      <path d="M45 155 Q70 140 95 155" stroke="#5C6B4B" strokeWidth="2" fill="none" />
      <path d="M105 155 Q130 140 155 155" stroke="#5C6B4B" strokeWidth="2" fill="none" />
    </svg>
  ),
  stories: (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="100" cy="80" r="35" stroke="#CFE0D0" strokeWidth="2" fill="#CFE0D020" />
      <path d="M100 180 Q100 150 70 130 Q40 110 40 80" stroke="#5C6B4B" strokeWidth="2" fill="#CFE0D040" />
      <path d="M100 180 Q100 150 130 130 Q160 110 160 80" stroke="#5C6B4B" strokeWidth="2" fill="#CFE0D040" />
      <circle cx="100" cy="80" r="12" fill="#8A4B1F" />
      <ellipse cx="90" cy="75" rx="3" ry="4" fill="#FFF5D6" />
      <ellipse cx="110" cy="75" rx="3" ry="4" fill="#FFF5D6" />
      <path d="M90 90 Q100 98 110 90" stroke="#FFF5D6" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="40" cy="40" r="10" fill="#FBD86B" />
      <circle cx="160" cy="40" r="10" fill="#FBD86B" />
      <circle cx="40" cy="160" r="10" fill="#FBD86B40" />
      <circle cx="160" cy="160" r="10" fill="#FBD86B40" />
    </svg>
  ),
  contact: (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M30 50 L170 50 L170 130 Q170 150 100 170 Q30 150 30 130 Z" stroke="#CFE0D0" strokeWidth="2" fill="#CFE0D020" />
      <path d="M50 70 L100 105 L150 70" stroke="#5C6B4B" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="100" cy="105" r="15" fill="#8A4B1F" />
      <path d="M92 100 L98 105 L108 95" stroke="#FFF5D6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M30 50 Q20 70 30 90" stroke="#FBD86B" strokeWidth="2" fill="none" />
      <path d="M170 50 Q180 70 170 90" stroke="#FBD86B" strokeWidth="2" fill="none" />
      <path d="M30 130 Q20 110 30 90" stroke="#FBD86B40" strokeWidth="2" fill="none" />
      <path d="M170 130 Q180 110 170 90" stroke="#FBD86B40" strokeWidth="2" fill="none" />
      <ellipse cx="70" cy="130" rx="25" ry="10" fill="#FBD86B20" />
      <ellipse cx="130" cy="130" rx="25" ry="10" fill="#FBD86B20" />
    </svg>
  ),
}

// Placeholder blob component for missing doodles
function PlaceholderBlob({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={className}>
      <defs>
        <radialGradient id="blobGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#CFE0D0" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FBD86B" stopOpacity="0.1" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#blobGradient)" />
      <circle cx="70" cy="70" r="30" fill="#FBD86B" opacity="0.2" />
      <circle cx="130" cy="130" r="25" fill="#8A4B1F" opacity="0.15" />
      <circle cx="130" cy="70" r="20" fill="#CFE0D0" opacity="0.25" />
      <circle cx="70" cy="130" r="20" fill="#CFE0D0" opacity="0.25" />
    </svg>
  )
}

export const Doodle = forwardRef<SVGSVGElement, DoodleProps>(
  ({ name, className, ...props }, ref) => {
    const content = doodles[name] || <PlaceholderBlob />

    return (
      <svg
        ref={ref}
        className={clsx('w-full h-auto max-w-xs md:max-w-sm lg:max-w-md', className)}
        aria-hidden="true"
        role="img"
        {...props}
      >
        {content}
      </svg>
    )
  }
)

Doodle.displayName = 'Doodle'

// Export list of available doodle names for reference
export const AVAILABLE_DOODLES = ['hero', 'about', 'videos', 'stories', 'contact'] as const
export type DoodleName = typeof AVAILABLE_DOODLES[number]