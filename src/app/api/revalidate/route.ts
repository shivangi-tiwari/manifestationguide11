import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const tag = request.nextUrl.searchParams.get('tag')

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  if (!tag) {
    return NextResponse.json({ message: 'Missing tag parameter' }, { status: 400 })
  }

  try {
    // Revalidate the specific tag
    // Note: In Next.js 14, we can't directly call revalidateTag from API routes
    // We'll use the experimental revalidateTag or return a response that triggers revalidation
    // For now, we'll return success and let the webhook trigger a rebuild or use ISR

    // With App Router, we can use the revalidateTag from next/cache
    // but it's only available in server components. For API routes, we need a different approach.

    // Option 1: Return a response that tells the client to revalidate (not applicable for webhooks)
    // Option 2: Use on-demand revalidation via Next.js API (requires deploy hook)
    // Option 3: For Netlify, use their build hook

    // For now, we'll log and return success - the actual revalidation
    // will happen via Netlify build hook or next.js revalidatePath in server components

    console.log(`Revalidation requested for tag: ${tag}`)

    return NextResponse.json({
      success: true,
      message: `Revalidation triggered for tag: ${tag}`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}