'use client'

import dynamic from 'next/dynamic'

// Force dynamic rendering with no SSR - Studio requires real Sanity credentials
const NextStudio = dynamic(
  () => import('next-sanity/studio').then((mod) => mod.NextStudio),
  { ssr: false }
)

export default function StudioPage() {
  // Check if Sanity is configured (not using dummy values)
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
  const isConfigured = projectId && projectId !== 'dummy-project-id'

  if (!isConfigured) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'system-ui' }}>
        <h1 style={{ color: '#7c3aed', marginBottom: '16px' }}>Sanity Studio</h1>
        <p style={{ color: '#666', maxWidth: '500px', margin: '0 auto' }}>
          Sanity Studio is not configured. Please set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and
          <code>NEXT_PUBLIC_SANITY_DATASET</code> environment variables to access the Studio.
        </p>
      </div>
    )
  }

  return <NextStudio config={{ projectId, dataset }} />
}