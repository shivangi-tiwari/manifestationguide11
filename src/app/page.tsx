export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-white dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Manifestation Coach
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Phase 1 complete — stripped to Sanity-only marketing site.
          Content, inquiries, and YouTube sync coming in next phases.
        </p>
        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Next: <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">npm install</code> then <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">npm run dev</code></p>
        </div>
      </div>
    </main>
  )
}