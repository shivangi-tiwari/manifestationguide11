import { NextRequest, NextResponse } from 'next/server'
import { sanityWriteClient } from '@/lib/sanity/writeClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
  thumbnailUrl?: string
}

interface VideoCandidate {
  youtubeId: string
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: string
  isSuccessStory: boolean
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
  const authHeader = request.headers.get('authorization')
  const dryRun = request.nextUrl.searchParams.get('dryRun') === '1'
  const startTime = Date.now()
  let created = 0
  let updated = 0
  let skipped = 0
  const errors: string[] = []

  try {
    // Verify cron secret
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

    // 2. Fetch full details (description, thumbnails, status)
    const videoIds = searchResults.map((v) => v.id)
    const videoDetails = await fetchVideoDetails(videoIds, apiKey)

    // 3. Get existing videos from Sanity to preserve manual edits
    const existingVideos = await sanityWriteClient.fetch<ExistingVideo[]>(
      `*[_type == "video"] { _id, youtubeId, thumbnailUrl }`
    )
    const existingByYoutubeId = new Map(existingVideos.map((v) => [v.youtubeId, v]))

    // 4. Plan only creates and thumbnail changes.
    const toCreate: VideoCandidate[] = []
    const toUpdate: Array<{ _id: string; youtubeId: string; thumbnailUrl: string }> = []

    for (const searchItem of searchResults) {
      const videoId = searchItem.id
      const details = videoDetails.get(videoId)

      if (!details) {
        errors.push(`Missing details for video ${videoId}`)
        continue
      }

      const snippet = details.snippet
      const thumbnailUrl = getBestThumbnail(snippet)
      if (!thumbnailUrl) {
        errors.push(`Missing thumbnail for video ${videoId}`)
        continue
      }

      const existing = existingByYoutubeId.get(videoId)

      if (existing) {
        if (existing.thumbnailUrl === thumbnailUrl) {
          skipped++
          continue
        }

        toUpdate.push({ _id: existing._id, youtubeId: videoId, thumbnailUrl })
        continue
      }

      toCreate.push({
        youtubeId: videoId,
        title: snippet.title,
        description: snippet.description || '',
        thumbnailUrl,
        publishedAt: snippet.publishedAt,
        isSuccessStory: /success\s*stor/i.test(snippet.title),
      })
    }

    if (dryRun) {
      created = toCreate.length
      updated = toUpdate.length
      const warning = errors.length > 0 ? 'Some videos could not be planned; review errors.' : null
      return NextResponse.json({
        success: true,
        dryRun: true,
        wouldCreate: toCreate,
        wouldUpdate: toUpdate.map(({ youtubeId, thumbnailUrl }) => ({ youtubeId, thumbnailUrl })),
        created,
        updated,
        skipped,
        errors,
        warning,
        durationMs: Date.now() - startTime,
      })
    }

    // A created ID and its initial fields are committed together; existing records get only thumbnailUrl.
    const operations = [
      ...toCreate.map((video) => ({ kind: 'create' as const, video })),
      ...toUpdate.map((video) => ({ kind: 'update' as const, video })),
    ]
    const BATCH_SIZE = 50
    for (let i = 0; i < operations.length; i += BATCH_SIZE) {
      const batch = operations.slice(i, i + BATCH_SIZE)
      const transaction = sanityWriteClient.transaction()

      for (const operation of batch) {
        if (operation.kind === 'create') {
          const { video } = operation
          const documentId = `video-${video.youtubeId}`
          transaction
            .createIfNotExists({ _id: documentId, _type: 'video' })
            .patch(documentId, {
              setIfMissing: {
                title: video.title,
                description: video.description,
                publishedAt: video.publishedAt,
                youtubeId: video.youtubeId,
                source: 'youtube-sync',
                isSuccessStory: video.isSuccessStory,
              },
              set: { thumbnailUrl: video.thumbnailUrl },
            })
        } else {
          transaction.patch(operation.video._id, {
            set: { thumbnailUrl: operation.video.thumbnailUrl },
          })
        }
      }

      await transaction.commit()
      created += batch.filter((operation) => operation.kind === 'create').length
      updated += batch.filter((operation) => operation.kind === 'update').length
    }

    const durationMs = Date.now() - startTime
    const warning = errors.length > 0 ? 'Some videos could not be synced; review errors.' : null
    console.log('[YouTube Sync] Completed:', { created, updated, skipped, errors: errors.length, durationMs })

    return NextResponse.json({
      success: true,
      created,
      updated,
      skipped,
      errors,
      warning,
      durationMs,
    })
  } catch (error) {
    console.error('[YouTube Sync] Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    errors.push(message)
    return NextResponse.json(
      {
        success: false,
        created,
        updated,
        skipped,
        errors,
        warning: 'The sync did not complete successfully; review errors.',
        durationMs: Date.now() - startTime,
      },
      { status: 500 }
    )
  }
}