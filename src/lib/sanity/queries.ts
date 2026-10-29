export const queries = {
  siteSettings: `*[_type == "siteSettings"][0] {
    title,
    tagline,
    hero,
    aboutSummary,
    contactEmail,
    instagramHandle,
    socialLinks,
    youtubeChannelId,
    mandatoryPlaylistId,
    mustWatchPlaylistUrl,
    mustWatchPlaylistId,
    seoDefaults,
    footerText,
    disclaimerText
  }`,

  pages: `*[_type == "page" && slug.current != "home"] | order(title asc) {
    title,
    slug,
    body,
    seo
  }`,

  pageBySlug: (slug: string) => `*[_type == "page" && slug.current == "${slug}"][0] {
    title,
    slug,
    body,
    seo
  }`,

  packages: `*[_type == "package" && published == true] | order(order asc, title asc) {
    _id,
    title,
    slug,
    shortDescription,
    fullDescription,
    price,
    currency,
    priceNote,
    duration,
    featured,
    order
  }`,

  featuredPackages: `*[_type == "package" && published == true && featured == true] | order(order asc) {
    _id,
    title,
    slug,
    shortDescription,
    fullDescription,
    price,
    currency,
    priceNote,
    duration
  }`,

  videos: `*[_type == "video" && hidden != true] | order(order asc, publishedAt desc) {
    _id,
    title,
    youtubeId,
    description,
    thumbnailUrl,
    publishedAt,
    category,
    featured,
    order,
    source
  }`,

  featuredVideos: `*[_type == "video" && hidden != true && featured == true] | order(order asc) {
    _id,
    title,
    youtubeId,
    description,
    thumbnailUrl,
    publishedAt,
    category
  }`,

  successStories: `*[_type == "successStory" && published == true] | order(order asc, date desc) {
    _id,
    clientName,
    photo,
    headline,
    story,
    youtubeVideoId,
    date,
    featured,
    order
  }`,

  featuredSuccessStories: `*[_type == "successStory" && published == true && featured == true] | order(order asc) {
    _id,
    clientName,
    photo,
    headline,
    story,
    youtubeVideoId,
    date
  }`,

  faqs: `*[_type == "faq"] | order(order asc) {
    _id,
    question,
    answer,
    order
  }`,
}