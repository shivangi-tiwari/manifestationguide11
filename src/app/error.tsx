'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Application route failed to render.', error)
  }, [error])

  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center text-olive"
    >
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">This page could not load</h1>
      <p className="mt-4 max-w-md text-base">
        Please try again. If the problem continues, return to the home page.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-[44px] items-center rounded-full bg-brown px-6 py-3 font-semibold text-cream hover:bg-brown/90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex min-h-[44px] items-center rounded-full border border-olive px-6 py-3 font-semibold text-olive hover:bg-olive/10"
        >
          Home
        </Link>
      </div>
    </main>
  )
}
