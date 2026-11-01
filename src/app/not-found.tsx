import Link from 'next/link'

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center text-olive"
    >
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em]">404</p>
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-md text-base">
        This page is unavailable. Return to the home page to continue browsing.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-[44px] items-center rounded-full bg-brown px-6 py-3 font-semibold text-cream hover:bg-brown/90"
      >
        Back to home
      </Link>
    </main>
  )
}
