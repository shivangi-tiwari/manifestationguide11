import urlBuilder from '@sanity/image-url'
import { sanityClient } from './client'

const builder = sanityClient ? urlBuilder(sanityClient) : null

export function urlFor(source: any) {
  if (!builder) return { url: () => '' } as any
  return builder.image(source)
}