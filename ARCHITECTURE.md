# Manifestation Coach Site: Architecture v3 (As-Built + Launch Plan)

Instructions for Claude Code. The v2 build phases (strip-down, Sanity, public pages, inquiry flow, YouTube sync) have been implemented. This document (1) describes the intended final architecture, (2) tells you to audit the repo against it, and (3) defines the remaining work: deployment, hardening, and a clean handover to a non-technical owner. It replaces v2.

**Start with Phase A. Do not skip the audit. Do not assume the code matches this document.**

## 1. Product summary

A marketing + content website for a manifestation coach. She manages everything from Sanity Studio (`/studio`). Visitors read content, watch her YouTube videos, read success stories, and send an inquiry. **No user accounts, no online checkout, no likes/comments, no payment code.** She replies to inquiries herself and collects payment herself (e.g. GPay/UPI). The site never handles money.

The owner of the site is non-technical. Everything must be operable from Studio plus her email. The build is a gift/barter from a developer who will hand over all accounts afterwards, so **nothing may depend on the developer's personal accounts or credentials** beyond what is documented in the handover pack.

## 2. Final stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router + TypeScript |
| Styling | Tailwind CSS 3 |
| CMS + admin | Sanity (Studio embedded at `/studio`) |
| Inquiries | Route handler -> Sanity `inquiry` doc (write token) + email via Resend |
| Video | YouTube embeds + daily sync into Sanity (GitHub Actions cron) |
| Payments | None |
| Hosting | Netlify free tier (host-neutral code; **do not use Vercel Hobby**, it is non-commercial only) |
| Source | GitHub private repo |

Removed and must not reappear: NextAuth, Supabase, Razorpay, Stripe, `/dashboard`, `/auth/*`, community features.

## 3. Content model (Sanity), intended

- `siteSettings` (singleton): site title, tagline, hero copy and CTA, about summary, contact email, Instagram handle, social links, YouTube channel ID, **mandatoryPlaylistId** (for auto-reply link), SEO defaults, footer text, disclaimer text.
- `page`: title, slug, portable-text body, SEO (About, Terms, Privacy, Refund/Cancellation, Disclaimer).
- `package`: title, slug, descriptions, price (optional; "Price on enquiry" if empty), currency, price note, duration, featured, order, published.
- `video`: title, youtubeId (unique), description, thumbnail, publishedAt, category, featured, hidden, order, source (`youtube-sync` | `manual`).
- `successStory`: client name or "Anonymous", optional photo, headline, story, optional YouTube ID, date, featured, order, published. Display only; no interaction.
- `faq`: question, answer, order.
- `inquiry`: name, email, phone, interest, message, preferred timing, status (`new` | `replied` | `closed`), createdAt, source. Created only server-side; visible in Studio.
- `post` (optional, only if already built).

## 4. Intended structure

```
src/
├── app/
│   ├── page.tsx, about/, packages/, videos/, success-stories/, contact/, [slug]/
│   ├── studio/[[...tool]]/page.tsx
│   └── api/{inquiry,cron/youtube-sync,revalidate}/route.ts
├── components/        # sections, cards, InquiryForm, InstagramButton
├── lib/{sanity,youtube.ts,email.ts,utils.ts}
├── sanity/{schemaTypes,sanity.config.ts}
└── types/
.github/workflows/youtube-sync.yml
```

## 5. Key behaviours (must hold)

- **Content:** fetched from Sanity via GROQ with tag `sanity`; `api/revalidate` verifies the Sanity webhook secret and calls `revalidateTag('sanity')`. Hidden/unpublished items never render.
- **YouTube sync:** idempotent upsert keyed on YouTube ID (`_id = video-<id>`). On create sets title/description/thumbnail/publishedAt. On existing docs it must **never overwrite** category, featured, hidden, order, or coach-edited text. Never deletes. Quota/API errors are logged, not fatal. Route requires `Authorization: Bearer ${CRON_SECRET}`; triggered daily by GitHub Actions.
- **Inquiry:** Zod validation, IP rate limit, honeypot, Cloudflare Turnstile, saved to Sanity first, then emailed to the coach (reply-to = visitor), plus an auto-reply to the visitor. Email failure must not lose the inquiry.
  - **Required checkbox:** "I agree to the Terms & Conditions and No-Refund Policy" (links to the full text in section 5) — form cannot submit without it.
  - **Auto-reply to visitor (verbatim):**
    > Kindly go through this playlist (https://youtube.com/playlist?list=PLAYLIST_ID) before starting a session and I will get in touch shortly!
    > (Playlist ID comes from `siteSettings.mandatoryPlaylistId` in Sanity; use placeholder if unset.)
  - No secrets in client bundles.
- **Payments:** Packages show "Enquire" (pre-selects the package in the form), a "How it works" block (inquire or DM on Instagram -> she replies and agrees a time -> she shares payment details directly -> session confirmed), and "Prices are subject to change."
- **Contact channels:** Instagram DM (`manifestationcoach55`) and email (`manifestationcoach55@gmail.com`) shown on the site; no WhatsApp.
- **Content tone & coach details (verbatim from coach):**

  **About me (use verbatim in About section):**
  > I am a mindset and Certified EFT, Certified NLP manifestation coach practicing law of Assumption having 6+ years Experience in law and teaching 1000+ clients in a simpler way to remove all the limiting beliefs and blockages in the path of manifestation. My teachings are based on learnings of neville goddard teachings, joseph murphy teachings and Spirituality (Advaita Vedanta).. I focus on self Concept work rather than gimme techniques. So if you are ready to transform and have your desires sustainable in your life. Connect with me and learn from my videos.
  >
  > Check playlist section on my channel for mandatory videos to get basics and posts session for any updates. Connect on Instagram for daily motivation.
  >
  > EVERY FRIDAY or Saturday WATCH NEW VIDEO UPLOADED!!!!!
  > DM me to book your 1:1 session with me and get your desired reality asap

  **No-refund policy & disclaimer (verbatim, must appear on contact/inquiry pages and in footer):**
  > **NO REFUNDS**  
  > **Prices are subject to change at any time**  
  > By purchasing any coaching services with me you are agreeing to the fact that any advice from me is nothing more than advice from my own experiences. You are also agreeing with my NO REFUND POLICY. You acknowledge that the responsibility whether you manifest or what you manifest is fully yours. I will not be held accountable for anything you manifest or not in your life. I am NOT a medical doctor and I do NOT give ANY MEDICAL ADVICE WHATSOEVER. The responsibility to follow my advice is fully yours.

  **Payment handling:** No payment code in the site. The coach accepts GPay/UPI directly after booking via DM/email. Packages show "Enquire" → inquiry form → she replies → shares payment details privately. Anything not from her must be a clearly marked placeholder.

## 6. Environment variables

```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=
SANITY_API_WRITE_TOKEN=
SANITY_REVALIDATE_SECRET=
YOUTUBE_API_KEY=
YOUTUBE_CHANNEL_ID=
CRON_SECRET=
RESEND_API_KEY=
INQUIRY_TO_EMAIL=
INQUIRY_FROM_EMAIL=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```
`.env.example` must match exactly and contain no real values.

## 7. Remaining phases

### Phase A: Audit and reconcile (do first)
- Compare the repo to sections 2 to 6. Produce `AUDIT.md` listing: matches, deviations, missing pieces, leftover dead code or deps (supabase, next-auth, razorpay, stripe, vercel-specific config), and any secret exposure.
- Fix deviations that break the "must hold" rules in section 5. For anything else, list it and ask before changing.
- Update this document's sections 3 and 4 so they describe what was actually built, keeping a short "Known deviations" list at the end.
- *Done when:* `npm run build`, `npm run lint`, and `tsc --noEmit` pass and `AUDIT.md` has no unresolved critical items.

### Phase B: Deploy on Netlify (free tier)
- Ensure the app builds and runs on Netlify with Next.js 14 (use Netlify's current Next.js runtime/adapter; add `netlify.toml` only if needed). Remove any Vercel-specific config.
- Document every environment variable and where to obtain it.
- Configure: Sanity CORS origin for the live URL and `/studio`; Sanity webhook to `/api/revalidate` with the secret; Turnstile allowed hostname; GitHub Actions secrets (`CRON_SECRET`, site URL) for the daily sync workflow, including a manual `workflow_dispatch` trigger.
- **Email caveat:** Resend only sends to arbitrary recipients from a verified domain. Until a custom domain is verified, `INQUIRY_TO_EMAIL` may need to equal the Resend account's own email, or use an alternative. Implement so the sender/recipient config is changeable by env vars only, and document the limitation in the README.
- *Done when:* the live `.netlify.app` site loads, Studio works at `/studio`, an edit in Studio appears on the site within seconds, a test inquiry saves to Sanity and emails the configured address, and a manual sync run imports her videos without duplicates.

### Phase C: Hardening and QA
- Security: headers (CSP-friendly), confirm service tokens are server-only, rate limit and Turnstile verified on the server, cron and revalidate reject bad secrets.
- Quality: Lighthouse on mobile (target 90+ performance, accessibility, SEO); lazy-load YouTube embeds; alt text required on CMS images; sitemap, robots, OpenGraph images, 404 and error pages.
- Content safety: empty states render gracefully when Studio has no videos, stories, or packages yet.
- Studio UX: field titles and descriptions written for a non-technical user; singleton settings; drag-to-reorder where relevant; a clear way to see new inquiries first.
- *Done when:* a fresh Studio user could add a story, hide a video, change a price, and mark an inquiry replied without guidance beyond the field labels.

### Phase D: Handover pack
Generate these files in the repo root (plain language, no jargon):
- `COACH-GUIDE.md`: one-page guide for the coach: how to open Studio, add a success story, hide or feature a video, edit text and prices, read and mark inquiries, what to do if videos stop appearing or inquiries stop arriving, and who to give the repo to if she ever wants bigger changes.
- `HANDOVER.md`: for the developer. Checklist to move ownership to the coach after she accepts: transfer the GitHub repo; she creates her Netlify account and imports the repo; add her as Sanity Administrator then remove the developer; recreate Resend and YouTube API keys under her accounts and update env vars; register any domain in her name; update the Sanity CORS/webhook/Turnstile settings and Actions secrets for the new URL; verify everything works after each step.
- `README.md`: setup, env vars, deploy, how the sync and inquiry flow work, known limits.

### Phase E: Later, only on request
- Custom domain and verified email sending domain.
- "Share your story" form creating an unpublished draft story for her approval.
- Newsletter/lead magnet capture.
- Optional blog/updates section.

## 8. Acceptance checklist

- [ ] Build, lint, and type-check pass; no leftover supabase, next-auth, razorpay, stripe, or Vercel-specific code
- [ ] No secret reachable from client bundles
- [ ] Cron and revalidate routes reject missing/incorrect secrets
- [ ] Inquiry flow: validation, rate limit, honeypot, Turnstile, saved to Sanity, email sent, terms checkbox required
- [ ] YouTube sync idempotent and preserves coach-edited fields
- [ ] Live on Netlify free tier; editing in Studio updates the site within seconds
- [ ] All content in Studio, nothing hard-coded except clearly marked placeholders
- [ ] Terms, Privacy, Refund/Cancellation, Disclaimer, and Contact pages exist and are in the footer
- [ ] Works well on mobile
- [ ] `COACH-GUIDE.md`, `HANDOVER.md`, `README.md`, `AUDIT.md` present and accurate

## 9. Working rules for Claude Code

- One phase at a time; run build and lint after each; summarise what changed.
- Do not invent facts about the coach. Use only the seed content in section 5, and mark everything else as a placeholder.
- Never commit secrets; update `.env.example` only.
- If the code conflicts with this document, explain the conflict and propose a fix before changing it, unless it violates a section 5 rule.
- Keep everything operable by a non-technical owner and transferable to her accounts.