'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { studioConfig } from '@/sanity/sanity.config'

const Studio = dynamic(
  () => import('sanity').then((mod) => mod.Studio),
  { ssr: false, loading: () => <div className="flex h-screen items-center justify-center">Loading Studio…</div> }
)

export default function StudioPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="flex h-screen items-center justify-center">Loading Studio…</div>
  }

  return <Studio config={studioConfig} />
}