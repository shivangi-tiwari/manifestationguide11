import { siteSettings } from './siteSettings'
import { page } from './page'
import { packageType } from './package'
import { video } from './video'
import { successStory } from './successStory'
import { faq } from './faq'
import { inquiry } from './inquiry'

export { siteSettings } from './siteSettings'
export { page } from './page'
export { packageType as package } from './package'
export { video } from './video'
export { successStory } from './successStory'
export { faq } from './faq'
export { inquiry } from './inquiry'

export const schemaTypes = [
  siteSettings,
  page,
  packageType,
  video,
  successStory,
  faq,
  inquiry,
]