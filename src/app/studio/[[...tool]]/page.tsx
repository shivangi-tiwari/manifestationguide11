import { studioConfig } from '@/cms/sanity.config'
import { NextStudio } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={studioConfig} />
}