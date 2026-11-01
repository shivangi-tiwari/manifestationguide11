import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  const tag = request.nextUrl.searchParams.get('tag') || 'sanity'

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    revalidateTag('sanity')
    if (tag !== 'sanity') revalidateTag(tag)
    return NextResponse.json({
      success: true,
      message: tag === 'sanity' ? 'Revalidated Sanity content' : `Revalidated Sanity content and tag: ${tag}`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}