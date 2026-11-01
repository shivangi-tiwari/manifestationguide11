# Manifestation Coach Site: Architecture v4 (Current State + Launch Plan)

For Claude Code. This replaces v3. The single-page site, Sanity Studio, inquiry flow and YouTube sync have been built. This file describes the intended final architecture, the rules that must hold, and the remaining work (fixes, audit, deploy, handover). **Do not assume the code matches this document. Audit first (see PROMPTS.md, prompt 2).**

## 1. Product

A single-page marketing and content website for an anonymous manifestation coach (brand: "Manifestation Guide", YouTube `@ManifestationGuide11`, Instagram `manifestationcoach55`, email `manifestationcoach55@gmail.com`).

- She manages everything from Sanity Studio at `/studio`.
- Visitors read, watch her YouTube videos, read success stories and send an inquiry.
- **No user accounts, no checkout, no payment code, no likes/comments.** She replies herself and collects payment herself (GPay/UPI). The site never handles money.
- The coach is anonymous: **no photos of people, no personal name anywhere** in code, seed text or metadata. Use the brand name from `siteSettings`.
- The site is built by a developer as a barter gift and will be handed over to her accounts. Nothing may depend on the developer's personal accounts beyond what `HANDOVER.md` documents.

## 2. Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router + TypeScript |
| Styling | Tailwind CSS 3, fonts via `next/font` (Cormorant Garamond headings, Arimo body) |
| CMS + admin | Sanity (project `ot38oy11t`, dataset `production`, Studio at `/studio`) |
| Inquiries | One server path: validate, save to Sanity, then email via Resend |
| Spam protection | Zod validation, IP rate limit, honeypot, Cloudflare Turnstile |
| Video | YouTube embeds, click-to-load; daily sync into Sanity |
| Payments | None |
| Hosting | Netlify free tier (host-neutral code; do NOT use Vercel Hobby: non-commercial only) |
| Scheduler | GitHub Actions scheduled workflow calling the sync route |
| Source | Private GitHub repo |

Removed and must not reappear: NextAuth, Supabase, Razorpay, Stripe, `/dashboard`, `/auth/*`, community features, WhatsApp.

## 3. Single-page structure

Route `/` renders five sections composed in `src/app/page.tsx` (a thin server component that fetches all Sanity data once and passes typed props down):

| id | Component | Content |
|---|---|---|
| `#home` | HeroSection | Brand headline, subheading, "Book a session" button, framed image |
| `#about` | AboutSection | About text from siteSettings, Instagram link |
| `#videos` | VideosSection | Title, Must-Watch Playlist callout (click-to-load), "How I teach" points, synced video grid, "Watch more on YouTube" |
| `#stories` | StoriesSection | Success-story videos (synced from her YouTube channel, detected by title) plus any optional written stories; "Results vary" note |
| `#contact` | ContactSection | Intro, packages (only if published), How it works, inquiry form, FAQ accordion, "Or DM directly" line |

Other routes: `/studio`, `[slug]` (CMS pages: terms, privacy, refund, disclaimer), `api/inquiry` or the single inquiry action, `api/cron/youtube-sync`, `api/revalidate`. Old routes (`/about`, `/videos`, `/success-stories`, `/contact`, `/packages`, `/faq`) 301-redirect to the matching `/#section`.

**Navbar:** sticky, scroll-spy via IntersectionObserver, smooth scroll, active link with `aria-current="location"`, mobile hamburger with focus trap and Esc to close, 44px tap targets, hash handling on first load. **Footer:** brand, email, Instagram, YouTube, legal links, "No refunds. Prices are subject to change.", copyright; optional developer credit controlled from Studio.

## 4. Content model (Sanity)

- `siteSettings` (singleton): title, tagline, hero.heading/subheading, aboutSummary, optional subtitles (`aboutSubtitle`, `storiesSubtitle`, `contactIntro`), contactEmail, Instagram, social links, YouTube channel ID, `mustWatchPlaylistUrl`, `mustWatchPlaylistId`, `sectionImages` (hero, about, videos, stories, contact), seoDefaults, footerText, disclaimerText, optional `developerCredit`.
- `page`: title, slug, portable-text body, SEO.
- `package`: title, description, price (optional; "Price on enquiry" if empty), currency, order, published.
- `video`: title, youtubeId (unique), description, thumbnail, publishedAt, category, featured, hidden, `isSuccessStory`, order, source. `isSuccessStory` is set automatically when a video is first created if its title matches /success\s*stor/i (case-insensitive); after that it is the coach's to change in Studio and the sync never overwrites it.
- `successStory` (optional, written stories the coach adds herself): name or "Anonymous", optional photo, headline, story, optional YouTube ID, date, featured, order, published.
- `faq`: question, answer, order.
- `inquiry`: name, email, phone, interest, message, preferred timing, status (`new` | `replied` | `closed`), createdAt, source. Created only server-side.

## 5. Rules that must hold

1. **Images never render nothing.** Sanity image with real width/height (parsed from the asset ref, no `fill` without a sized parent); fallback is a visible soft colour shape. Images are decorative unless alt text is provided. `cdn.sanity.io` allowed in `next.config.mjs`.
2. **No invented copy.** All visible text comes from Sanity or a clearly marked placeholder. No fake testimonials, statistics, promises (for example response times) or `example.com` addresses. Empty data hides the element or shows a tidy empty state.
3. **Contrast:** text on dark olive surfaces is cream; all text meets WCAG AA.
4. **Inquiry flow:** exactly one path with Zod validation, IP rate limit, honeypot, Turnstile server verification, save to Sanity first, email second (failure must not lose the inquiry), visitor acknowledgement, required terms checkbox. No secrets in client bundles.
5. **YouTube sync:** idempotent upsert keyed on YouTube ID (`_id = video-<id>`); never overwrites coach-edited fields (category, featured, hidden, isSuccessStory, order, title, description); never deletes; uses the official YouTube API or RSS feed, never HTML scraping; logs failures without crashing; route requires `Authorization: Bearer ${CRON_SECRET}`.
6. **Sanity client fails loudly in production** when credentials are missing; it may relax only during the build step.
7. **Contact section order:** heading, intro, packages, How it works, form, FAQ, DM line.
8. **Success-story videos appear in the Stories section** (videos with `isSuccessStory` true, hidden excluded), shown as click-to-load video cards, newest or featured first. They are not repeated in the Videos grid. Written `successStory` documents, if any exist, appear alongside them. Videos are only ever embedded through the YouTube player; thumbnails come from YouTube and are not re-hosted.
9. **Mobile first:** body text at least 16px, no horizontal scroll, tap targets at least 44px. Decorations scale down, never get hidden entirely.
10. Fixed order of build steps matters less than keeping every step small, with a build passing at the end of each.

## 6. Design system (botanical, calm)

Cream `#FFF5D6`, sage `#CFE0D0`, butter yellow `#FBD86B`, olive `#5C6B4B`, brown `#8A4B1F`. Yellow is for fills only, never text. Arch, oval and circle image frames with a thin olive border and offset shadow; scalloped dividers between sections; large numerals 01 to 05; section backgrounds alternate cream, sage, butter. Illustrations are Open Doodles by Pablo Stanley (CC0), uploaded through Studio (`sectionImages`); see `CREDITS.md`.

## 7. Environment variables

```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SANITY_PROJECT_ID=ot38oy11t
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=            # server only
SANITY_API_WRITE_TOKEN=           # server only
SANITY_REVALIDATE_SECRET=
YOUTUBE_CHANNEL_ID=
YOUTUBE_API_KEY=                  # only if the sync uses the Data API; RSS needs none
CRON_SECRET=
RESEND_API_KEY=                   # server only
INQUIRY_TO_EMAIL=
INQUIRY_FROM_EMAIL=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```
`.env.example` has the same names with no values. `.env.local` is git-ignored and never committed.

## 8. Remaining work (see PROMPTS.md for the exact prompts)

1. Bug-fix pass (contact order, videos vs stories, playlist click card, pill contrast, placeholder subtitles, mobile image size).
2. Audit (`AUDIT.md`): inquiry path, image handling, client behaviour, secrets, leftovers, `metadataBase`, YouTube sync mode.
3. Inquiry flow and YouTube sync verification, with test steps.
4. Studio UX (field descriptions, inquiries list, singleton settings, reorder).
5. Netlify preparation (host-neutral config, GitHub Actions workflow, env docs).
6. Polish and QA (Lighthouse, accessibility, 404, sitemap, robots, OG, security headers).
7. Handover pack check (`README.md`, `COACH-GUIDE.md`, `HANDOVER.md`, `CREDITS.md`).

Later, only on request: custom domain with verified email sending, "Share your story" form that creates an unpublished draft for approval, newsletter capture.

## 9. Acceptance checklist

- [ ] `npm run build`, `npm run lint`, `tsc --noEmit` pass
- [ ] No supabase, next-auth, razorpay, stripe, vercel-specific code or deps remain
- [ ] No secret reachable from client bundles
- [ ] Cron and revalidate routes reject missing or wrong secrets
- [ ] One inquiry path, all protections on; test inquiry saves to Sanity and emails the coach
- [ ] Sync is idempotent and preserves coach-edited fields (hide and feature survive a re-sync)
- [ ] Live on Netlify; an edit in Studio appears on the site within seconds
- [ ] No placeholder or invented text visible on the live site
- [ ] Legal pages (Terms, Privacy, Refund, Disclaimer) exist and are linked in the footer
- [ ] Works well on a real phone; Lighthouse mobile in the green
- [ ] Docs present and accurate: README, COACH-GUIDE, HANDOVER, CREDITS, AUDIT

## 10. Working rules for Claude Code

- One task at a time. Stop and report the exact error after 3 failed attempts.
- Do not install packages unless the prompt says so.
- Do not retry mobile screenshots (the preview tool is unreliable); review mobile by code and report responsive risks.
- Never commit secrets. Update `.env.example` only.
- Do not invent facts about the coach. Placeholders must be clearly marked.
- If the code conflicts with this document, explain and propose a fix before changing it, unless a rule in section 5 is violated.