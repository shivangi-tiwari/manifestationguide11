'use client'

import Image from 'next/image'
import { SanityImageBlock } from '@/types'
import { Doodle } from '@/components/ui/Doodle'
import { clsx } from 'clsx'
import { urlFor } from '@/lib/sanity/image'

interface SectionImageProps {
  sanityImage?: SanityImageBlock
  doodleName: 'hero' | 'about' | 'videos' | 'stories' | 'contact'
  alt?: string
  className?: string
  priority?: boolean
}

export function SectionImage({ sanityImage, doodleName, alt = '', className, priority = false }: SectionImageProps) {
  const assetRef = sanityImage?.asset?._ref
  const dimensions = assetRef?.match(/^image-.+-(\d+)x(\d+)-([a-z0-9]+)$/i)
  const imageUrl = assetRef ? urlFor(sanityImage).width(dimensions ? Number(dimensions[1]) : 800).url() : ''
  const containerClassName = clsx(
    'relative mx-auto w-full aspect-[4/5] overflow-hidden rounded-t-full border-2 border-olive bg-sage shadow-[0.5rem_0.5rem_0_#5C6B4B]',
    className || 'max-w-[260px] lg:max-w-md'
  )
  const imageAlt = alt || `Section illustration for ${doodleName}`

  if (imageUrl) {
    const imageProps = {
      src: imageUrl,
      sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 320px',
      priority,
      className: 'max-w-full object-contain p-6',
    }

    if (dimensions) {
      const extension = dimensions[3].toLowerCase()
      return (
        <div className={clsx(containerClassName, 'flex items-end justify-center')}>
          <Image
            {...imageProps}
            alt={imageAlt}
            width={Number(dimensions[1])}
            height={Number(dimensions[2])}
            unoptimized={extension === 'gif' || extension === 'svg'}
            style={{ width: '100%', height: 'auto', maxHeight: '100%' }}
          />
        </div>
      )
    }

    return (
      <div className={containerClassName}>
        <Image
          {...imageProps}
          alt={imageAlt}
          fill
        />
      </div>
    )
  }

  return (
    <div className={containerClassName}>
      <Doodle name={doodleName} />
    </div>
  )
}