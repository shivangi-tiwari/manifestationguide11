import { NextRequest, NextResponse } from 'next/server'
import { sanityWriteClient } from '@/lib/sanity/writeClient'

interface YouTubeSearchItem {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    description: string
    publishedAt: string
    thumbnails: {
      maxres?: { url: string; width: number; height: number }
      high?: { url: string; width: number; height: number }
      medium?: { url: string; width: number; height: number }
      default?: { url: string; width: number; height: number }
    }
    channelId: string
  }
}

interface YouTubeVideoItem {
  id: string
  snippet: {
    title: string
    description: string
    publishedAt: string
    thumbnails: {
      maxres?: { url: string; width: number; height: number }
      high?: { url: string; width: number; height: number }
      medium?: { url: string; width: number; height: number }
      default?: { url: string; width: number; height: number }
    }
    channelId: string
  }
  status?: {
    privacyStatus: string
  }
}

interface ExistingVideo {
  _id: string
  youtubeId: string
  category: string
  featured: boolean
  hidden: boolean
  isSuccessStory?: boolean
  order: number
  title: string
  description: string
  source: 'youtube-sync' | 'manual'
}

interface SyncResult {
  created: number
  updated: number
  errors: string[]
}

const MAX_RESULTS_PER_PAGE = 50
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3'

async function fetchAllChannelVideos(channelId: string, apiKey: string): Promise<YouTubeVideoItem[]> {
  const videos: YouTubeVideoItem[] = []
  let nextPageToken: string | undefined

  do {
    const url = new URL(`${YOUTUBE_API_URL}/search`)
    url.searchParams.set('part', 'snippet')
    url.searchParams.set('channelId', channelId)
    url.searchParams.set('maxResults', String(MAX_RESULTS_PER_PAGE))
    url.searchParams.set('order', 'date')
    url.searchParams.set('type', 'video')
    url.searchParams.set('key', apiKey)
    if (nextPageToken) url.searchParams.set('pageToken', nextPageToken)

    const response = await fetch(url.toString())
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`YouTube API error: ${response.status} ${JSON.stringify(error)}`)
    }

    const data = await response.json()
    if (data.items?.length) {
      // Search results have id.videoId, not id directly
      for (const item of data.items) {
        const videoId = item.id?.videoId
        if (videoId) {
          videos.push({
            id: videoId,
            snippet: item.snippet,
          })
        }
      }
    }
    nextPageToken = data.nextPageToken
  } while (nextPageToken)

  return videos
}

async function fetchVideoDetails(videoIds: string[], apiKey: string): Promise<Map<string, YouTubeVideoItem>> {
  const details = new Map<string, YouTubeVideoItem>()
  const chunks: string[][] = []
  for (let i = 0; i < videoIds.length; i += 50) {
    chunks.push(videoIds.slice(i, i + 50))
  }

  for (const chunk of chunks) {
    const url = new URL(`${YOUTUBE_API_URL}/videos`)
    url.searchParams.set('part', 'snippet,status')
    url.searchParams.set('id', chunk.join(','))
    url.searchParams.set('key', apiKey)

    const response = await fetch(url.toString())
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`YouTube API error (details): ${response.status} ${JSON.stringify(error)}`)
    }

    const data = await response.json()
    for (const item of data.items || []) {
      details.set(item.id, item)
    }
  }

  return details
}

function getBestThumbnail(snippet: YouTubeVideoItem['snippet']): string | undefined {
  return snippet.thumbnails.maxres?.url
    ?? snippet.thumbnails.high?.url
    ?? snippet.thumbnails.medium?.url
    ?? snippet.thumbnails.default?.url
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const channelId = process.env.YOUTUBE_CHANNEL_ID
    const apiKey = process.env.YOUTUBE_API_KEY

    if (!channelId || !apiKey) {
      return NextResponse.json(
        { error: 'Missing YOUTUBE_CHANNEL_ID or YOUTUBE_API_KEY' },
        { status: 500 }
      )
    }

    console.log('[YouTube Sync] Starting sync for channel:', channelId)

    // 1. Fetch all video IDs from channel
    const searchResults = await fetchAllChannelVideos(channelId, apiKey)
    console.log('[YouTube Sync] Found', searchResults.length, 'videos in channel')

    if (searchResults.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No videos found in channel',
        created: 0,
        updated: 0,
        durationMs: Date.now() - startTime,
      })
    }

    // 2. Fetch full details (description, thumbnails, status)
    const videoIds = searchResults.map((v) => v.id)
    const videoDetails = await fetchVideoDetails(videoIds, apiKey)

    // 3. Get existing videos from Sanity to preserve manual edits
    const existingVideos = await sanityWriteClient.fetch<ExistingVideo[]>(
      `*[_type == "video"] { _id, youtubeId, category, featured, hidden, isSuccessStory, order, title, description, source }`
    )
    const existingByYoutubeId = new Map(existingVideos.map((v) => [v.youtubeId, v]))

    // 4. Prepare Sanity mutations
    const mutations: any[] = []
    let created = 0
    let updated = 0
    const errors: string[] = []

    for (const searchItem of searchResults) {
      const videoId = searchItem.id
      const details = videoDetails.get(videoId)

      if (!details) {
        errors.push(`Missing details for video ${videoId}`)
        continue
      }

      const snippet = details.snippet
      const thumbnailUrl = getBestThumbnail(snippet)
      const existing = existingByYoutubeId.get(videoId)

      const docId = existing?._id ?? `video-${videoId}`

      // Determine source: preserve 'manual' if already set, otherwise 'youtube-sync'
      const source = existing?.source === 'manual' ? 'manual' : 'youtube-sync'

      const videoDoc = {
        _type: 'video',
        _id: docId,
        youtubeId: videoId,
        title: snippet.title,
        description: snippet.description || '',
        thumbnailUrl,
        publishedAt: snippet.publishedAt,
        category: existing?.category || '',
        featured: existing?.featured ?? false,
        hidden: existing?.hidden ?? false,
        order: existing?.order ?? 0,
        source,
        ...(existing ? {} : { isSuccessStory: /success\s*stor/i.test(snippet.title) }),
      }

      if (existing) {
        mutations.push({
          patch: {
            id: docId,
            set: videoDoc,
          },
        })
        updated++
      } else {
        mutations.push({
          create: videoDoc,
        })
        created++
      }
    }

    // 5. Execute mutations in batches
    if (mutations.length > 0) {
      const BATCH_SIZE = 100
      for (let i = 0; i < mutations.length; i += BATCH_SIZE) {
        const batch = mutations.slice(i, i + BATCH_SIZE)
        await sanityWriteClient.transaction(batch).commit()
      }
    }

    const durationMs = Date.now() - startTime
    console.log('[YouTube Sync] Completed:', { created, updated, errors: errors.length, durationMs })

    return NextResponse.json({
      success: true,
      created,
      updated,
      errors,
      durationMs,
    })
  } catch (error) {
    console.error('[YouTube Sync] Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Sync failed', message, durationMs: Date.now() - startTime },
      { status: 500 }
    )
  }
}