# Phase A Audit — Architecture v4

**Reviewed:** 2026-11-01
**Scope:** Architecture sections 2–7 and Prompt 2 checks against the current repository.

## Executive summary

The project is a Next.js 14 App Router site with Sanity, Resend, Turnstile, and a YouTube Data API sync. The site has one home-page inquiry flow, image dimensions are now derived from Sanity asset IDs, and missing Sanity project configuration fails outside the production-build step. The previous report described an earlier repository state and has been replaced.

Prompt 2 items 1–6 have been implemented. Prompt 2 items 7–10 were audited; deviations and known risks are listed below rather than changed outside the requested critical-fix scope.

## Architecture sections 2–7

### 2. Stack

| Requirement | Finding |
|---|---|
| Next.js 14, TypeScript, Tailwind 3 | Matches the package manifest and app structure. |
| Sanity CMS and embedded Studio | Sanity clients and schemas exist. Studio currently registers only `siteSettings`; the other document types are not available in its desk. Prompt 4 addresses this. |
| One protected inquiry path | The form calls `src/app/actions/inquiry.ts`. The duplicate `/api/inquiry` route has been removed. |
| Spam controls | Server-side Zod validation, honeypot, Turnstile verification, and a five-attempts-per-minute IP limit are implemented. The limiter is process-local; see known risks. |
| Hosting | No Vercel deployment config or direct Vercel dependency is present. No `netlify.toml` exists; Prompt 5 will determine whether one is needed. |
| Removed features | No direct Supabase, NextAuth, Razorpay, Stripe, or WhatsApp implementation/dependency remains. `@vercel/edge` and `@vercel/stega` are transitive dependencies of Sanity packages, not direct dependencies or hosting configuration. |

### 3. Site structure

The home page renders the Hero, About, Videos & Teaching, Success stories, and Contact sections. The contact DOM order is heading, optional intro, published packages, How it works, form, FAQ, and the direct-message line. Older section routes redirect to home-page anchors. Terms & Conditions is the remaining policy page, matching the user's later direction even though older architecture prose mentions additional policies.

Some legacy route/component files remain alongside those redirects. `About.tsx`, `FeaturedVideos.tsx`, and `SuccessStories.tsx` have no current imports from the home page and should be treated as dead code until removed in an approved cleanup.

### 4. Sanity content model

Schemas and TypeScript types exist for Site Settings, pages, packages, videos, success stories, FAQs, and inquiries. Optional `aboutSubtitle`, `storiesSubtitle`, `contactIntro`, and `developerCredit` are queried and hidden when empty. The `isSuccessStory` video field is editor-controlled after creation.

Studio currently exposes only the Site Settings singleton. Other schemas are not registered in `sanity.config.ts`, so the editor cannot manage packages, videos, stories, FAQs, pages, or inquiries there yet. The inquiry action writes `termsAccepted`, but the inquiry schema does not define that field; Studio will not show the recorded value until the schema is reconciled.

### 5. Required behavior

| Rule | Finding |
|---|---|
| Sanity images use the shared URL helper and real dimensions | Section images and written-story photos use `urlFor`; dimensions come from Sanity asset IDs and are supplied to `next/image`. Responsive image frames are capped at 260px below `lg` and 448px from `lg`. |
| Empty/optional content | The optional section subtitles, social links, playlist controls, and footer disclaimer are hidden when unconfigured. A success-story empty state is present. |
| Contact flow | The form uses one Server Action. It validates with Zod, rejects a filled honeypot or invalid/missing Turnstile token, limits accepted requests per IP, saves to Sanity before attempting email, records consent, and returns success after an email failure while logging that failure. Sender and recipient are environment-only (`INQUIRY_FROM_EMAIL`, `INQUIRY_TO_EMAIL`). |
| YouTube sync | Uses the official YouTube Data API, creates deterministic `video-<id>` documents, does not delete documents, sets `isSuccessStory` only on creation, and preserves category, featured, hidden, and order. It currently overwrites title and description on existing documents, contrary to Architecture §5. |
| Revalidation | `/api/revalidate` checks `SANITY_REVALIDATE_SECRET` and calls `revalidateTag('sanity')`; the secret is accepted as a query parameter, which can expose it to request logs. |
| Design | The site uses the documented cream, sage, butter, olive, and brown palette. Teaching text is brown on sage and passes the previously measured 4.9:1 contrast ratio. |
| Build-time Sanity fallback | Missing project configuration is tolerated only when `NEXT_PHASE` is the production-build phase; the normal runtime throws instead of returning empty content. |

### 6. Design system

The main section components use the botanical palette and shared image-frame component. The shared frame had a `max-w-full` utility that overrode its responsive maximum; this was removed, and browser measurements now show the 260px narrow frame and 448px desktop frame. No desktop image exceeds its frame.

### 7. Environment variables and secrets

`.env.example` contains the documented variable names. `.env` and `.env.local` are ignored by Git. The source scan found no server-only token imported by a Client Component and no `NEXT_PUBLIC_` secret. The Sanity write client is used from server-side code only; YouTube API credentials are read from the server-rendered page/sync route.

`NEXT_PUBLIC_SITE_URL` is empty in the local environment, so `metadataBase` deliberately falls back to localhost. The production deployment must set this variable to the public site URL.

## Prompt 2 checks

| # | Result | Finding |
|---|---|---|
| 1 | Fixed | The form uses one Server Action; the duplicate API route is removed. Server validation, IP rate limit, honeypot, Turnstile, Sanity-first persistence, post-save email/acknowledgement, and required terms acceptance are in place. |
| 2 | Fixed | The `as string` image cast is removed. Sanity photos use the shared image helper and real width/height; image types are explicit. |
| 3 | Fixed | Missing Sanity project configuration fails outside the production-build phase. Only a build with missing configuration uses the empty-data fallback. |
| 4 | Pass | No secret access was found in Client Components or their imports. |
| 5 | Pass with documentation cleanup pending | No direct forbidden dependencies, WhatsApp code, or Vercel config remains. The README is still the generic Vercel starter and will be replaced in Prompt 5. The remaining `@vercel/*` packages are transitive dependencies of Sanity and are not safe to remove independently. |
| 6 | Fixed | Root metadata now sets `metadataBase` from `NEXT_PUBLIC_SITE_URL`, with a localhost fallback when the variable is blank. |
| 7 | Deviation | Sync uses the Data API and has deterministic IDs, no deletes, and create-only `isSuccessStory`; it preserves category/featured/hidden/order but overwrites title and description during updates. Fatal upstream errors return HTTP 500 rather than success-with-warning. |
| 8 | Pass | Components use the shared `urlFor` helper; no component creates a second Sanity client. |
| 9 | Pass | No `@ts-expect-error` or `eslint-disable` comments were found in `src`. |
| 10 | Pass | Video sync uses the official YouTube Data API; no YouTube HTML scraping was found. `isSuccessStory` is set only when a video document is created. |

## Remaining deviations and risks

1. **Sync preserves some but not all editor choices.** Existing video titles and descriptions are overwritten during sync. The sync also returns an error status for fatal YouTube failures rather than a success response with warnings. Prompt 2 requested these as audit findings and limited fixes to items 1–6; approval is needed before changing this behavior.
2. **IP rate limiting is process-local.** It reliably limits repeated requests handled by one running process, but separate/cold Netlify function instances do not share counters. A shared limiter would need a persistent service or storage design.
3. **Revalidation secret is in the query string.** Consider moving it to a request header to reduce exposure in access logs.
4. **Studio schemas are incomplete in the live configuration.** Only Site Settings is registered. Prompt 4 covers the editor-facing schema/desk work.
5. **Handover/deploy documentation is incomplete.** README is starter content; `COACH-GUIDE.md`, `HANDOVER.md`, and `CREDITS.md` are absent. Prompts 3, 5, and 7 cover those materials.
6. **Legacy code remains.** The three unused section components listed above contain older hard-coded UI and image handling. They do not appear in the current home-page imports.
7. **Production configuration remains necessary.** Set `NEXT_PUBLIC_SITE_URL`, Sanity, Turnstile, Resend, and cron variables in the deployment environment; no values are recorded in this report.

## Validation

`npm run build`, `npm run lint`, and `npx tsc --noEmit` pass. The build and lint report two `<img>` warnings in legacy `About.tsx` and `SuccessStories.tsx`; the build also logs a dynamic-server-usage diagnostic for the request-dependent YouTube cron route before classifying it as dynamic.
