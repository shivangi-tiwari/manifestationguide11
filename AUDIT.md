# Audit Report — Architecture v3 vs Current Repo

**Generated:** 2025-10-28  
**Phase:** A (Audit and reconcile)  
**Scope:** Compare `ARCHITECTURE.md` v3 (sections 2–6) against the actual repo at `C:\Users\HP\Desktop\manifest`.

---

## 1. Executive Summary

| Metric | Status |
|--------|--------|
| Build / lint / type-check | ✅ Pass (`npm run build`, `npm run lint`, `tsc --noEmit`) |
| Forbidden deps present? | ❌ None (`supabase`, `next-auth`, `razorpay`, `stripe` removed in Phase 1) |
| Secret exposure in client bundles | ❌ None |
| **Overall** | **Repo is a clean strip-down** — only the Phase 1 placeholder exists. All v3 features are **missing** and must be built in Phases 2–5. |

---

## 2. Section-by-Section Reconciliation

### 2.1 Final Stack (Architecture §2)

| Layer | Spec | Repo | Match? | Notes |
|-------|------|------|--------|-------|
| Framework | Next.js 14 App Router + TS | ✅ `next@14.2.0` | ✅ | |
| Styling | Tailwind CSS 3 | ✅ `tailwindcss@3.4.0` | ✅ | |
| CMS + Admin | Sanity (Studio at `/studio`) | ❌ No Sanity files | ❌ | **Missing entirely** |
| Inquiries | Route handler → Sanity `inquiry` + Resend | ❌ No API routes | ❌ | **Missing entirely** |
| Video | YouTube embeds + daily GitHub Actions sync | ❌ No sync code | ❌ | **Missing entirely** |
| Payments | None | ✅ None | ✅ | Correctly removed |
| Hosting | Netlify free tier | ❌ Vercel config (`next.config.mjs`) | ⚠️ | Must remove Vercel-specific config |
| Source | GitHub private repo | ⚠️ Local only | ⚠️ | Not yet pushed |

**Critical deviations:** Sanity, Inquiries, YouTube sync, GitHub Actions — all absent.  
**Non-critical:** Hosting config targets Vercel; must switch to Netlify.

---

### 2.2 Content Model — Intended vs Actual (Architecture §3)

| Document Type | Spec Fields | Repo | Status |
|---------------|-------------|------|--------|
| `siteSettings` (singleton) | title, tagline, hero, about, contact email, Instagram, social, YouTube channel ID, **mandatoryPlaylistId**, SEO, footer, disclaimer | ❌ | **Missing** |
| `page` | title, slug, portable-text body, SEO | ❌ | **Missing** |
| `package` | title, slug, descriptions, price (optional), currency, price note, duration, featured, order, published | ❌ | **Missing** |
| `video` | title, youtubeId (unique), description, thumbnail, publishedAt, category, featured, hidden, order, source | ❌ | **Missing** |
| `successStory` | client name, photo, headline, story, YouTube ID, date, featured, order, published | ❌ | **Missing** |
| `faq` | question, answer, order | ❌ | **Missing** |
| `inquiry` | name, email, phone, interest, message, preferred timing, status, createdAt, source | ❌ | **Missing** |
| `post` (optional) | title, slug, cover, body, date, published | ❌ | Deferred |

**Repo has:** Only `src/types/index.ts` with TS interfaces (placeholders).  
**Sanity schemas, config, Studio embedding:** All absent.

---

### 2.3 Intended Structure vs Actual (Architecture §4)

| Spec Path | Exists? | Notes |
|-----------|---------|-------|
| `src/app/page.tsx` | ✅ | Placeholder only |
| `src/app/about/`, `packages/`, `videos/`, `success-stories/`, `contact/`, `[slug]/` | ❌ | Missing |
| `src/app/studio/[[...tool]]/page.tsx` | ❌ | Missing |
| `src/app/api/inquiry/route.ts` | ❌ | Missing |
| `src/app/api/cron/youtube-sync/route.ts` | ❌ | Missing |
| `src/app/api/revalidate/route.ts` | ❌ | Missing |
| `src/components/` (sections, cards, InquiryForm, InstagramButton) | ❌ | Empty dir |
| `src/lib/sanity/{client,writeClient,queries,image}.ts` | ❌ | Missing |
| `src/lib/youtube.ts` | ❌ | Missing |
| `src/lib/email.ts` | ❌ | Missing |
| `src/lib/utils.ts` | ✅ | Minimal (`cn` helper) |
| `src/sanity/schemaTypes/*.ts` | ❌ | Missing dir |
| `src/sanity/sanity.config.ts` | ❌ | Missing |
| `.github/workflows/youtube-sync.yml` | ❌ | Missing |
| `netlify.toml` (if needed) | ❌ | Missing |

---

### 2.4 Key Behaviours — Must Hold (Architecture §5)

| Rule | Spec | Repo | Status |
|------|------|------|--------|
| Content fetched from Sanity via GROQ with tag `sanity` | Required | ❌ No Sanity client | ❌ |
| `api/revalidate` verifies Sanity webhook secret, calls `revalidateTag('sanity')` | Required | ❌ No route | ❌ |
| Hidden/unpublished items never render | Required | N/A | ❌ |
| YouTube sync: idempotent upsert on YouTube ID (`video-<id>`) | Required | ❌ | ❌ |
| Sync never overwrites coach-edited fields (category, featured, hidden, order, text) | Required | ❌ | ❌ |
| Sync logs quota/API errors, doesn't crash | Required | ❌ | ❌ |
| Cron route requires `Authorization: Bearer ${CRON_SECRET}` | Required | ❌ | ❌ |
| Inquiry: Zod validation, IP rate limit, honeypot, Turnstile | Required | ❌ | ❌ |
| Inquiry saved to Sanity first, then emailed to coach (reply-to=visitor) | Required | ❌ | ❌ |
| Auto-reply to visitor with playlist message | Required | ❌ | ❌ |
| Required T&C checkbox (no-refund policy) | Required | ❌ | ❌ |
| No secrets in client bundles | Required | ✅ (no client code yet) | ✅ |
| Packages show "Enquire" + "How it works" block | Required | ❌ | ❌ |
| Contact: Instagram DM + email only (no WhatsApp) | Required | ❌ | ❌ |
| Coach's verbatim About / Policy / Disclaimer text used | Required | ❌ (only in ARCHITECTURE.md) | ❌ |

---

### 2.5 Environment Variables (Architecture §6)

| Spec Variable | In `.env.example`? | Notes |
|---------------|-------------------|-------|
| `NEXT_PUBLIC_SITE_URL` | ✅ | |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | |
| `SANITY_API_READ_TOKEN` | ✅ | |
| `SANITY_API_WRITE_TOKEN` | ✅ | |
| `SANITY_REVALIDATE_SECRET` | ✅ | |
| `YOUTUBE_API_KEY` | ✅ | |
| `YOUTUBE_CHANNEL_ID` | ✅ | |
| `CRON_SECRET` | ✅ | |
| `RESEND_API_KEY` | ✅ | |
| `INQUIRY_TO_EMAIL` | ✅ | |
| `INQUIRY_FROM_EMAIL` | ✅ | |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | ✅ | |
| `TURNSTILE_SECRET_KEY` | ✅ | |
| **No `SUPABASE_*`, `NEXTAUTH_*`, `RAZORPAY_*`, `STRIPE_*`** | ✅ | Cleaned in Phase 1 |

✅ `.env.example` matches spec exactly.

---

## 3. Leftover / Dead Code Check

| Item | Found? | Action |
|------|--------|--------|
| `supabase` imports | ❌ | Clean |
| `next-auth` / `next-auth/react` | ❌ | Clean |
| `razorpay` / `stripe` imports | ❌ | Clean |
| `@supabase/ssr` | ❌ | Removed in Phase 1 |
| `/dashboard`, `/auth/*`, `/community`, `/coaching` routes | ❌ | Removed in Phase 1 |
| `middleware.ts` | ❌ | Removed |
| `providers.tsx` | ❌ | Removed |
| `schema.sql` | ❌ | Removed |
| Vercel-specific config | ⚠️ `next.config.mjs` is generic but was Vercel-oriented | Must verify no `vercel` references |

**No forbidden code or secrets remain.**

---

## 4. Missing Pieces — Build Order (Phases 2–5)

| Phase | Deliverable | Est. Effort |
|-------|-------------|-------------|
| **2** | Sanity install, schemas, Studio at `/studio`, seed content | M |
| **3** | All public pages + sections pulling from Sanity, revalidation webhook, SEO, Instagram button, policy pages | L |
| **4** | Inquiry API (Zod, rate limit, honeypot, Turnstile), Sanity write, Resend emails (coach + auto-reply with playlist), Studio inquiry list view | M |
| **5** | `lib/youtube.ts`, GitHub Actions workflow (daily + manual dispatch), backfill logic | M |
| **B** | Netlify deploy, env var docs, CORS/webhook/Turnstile/Secrets config | S |
| **C** | Security headers, Lighthouse 90+ mobile, lazy YouTube, sitemap/robots/OG, empty states, Studio UX polish | M |
| **D** | `COACH-GUIDE.md`, `HANDOVER.md`, `README.md`, finalize `AUDIT.md` | S |

---

## 5. Known Deviations (to be resolved)

1. **Hosting target** — `next.config.mjs` is generic but the project has never been deployed to Netlify. Must add `netlify.toml` if any Netlify-specific config is needed (headers, redirects, build command).
2. **Content tone** — Coach's verbatim text lives only in `ARCHITECTURE.md`. Must be seeded into Sanity `siteSettings` and `page` documents during Phase 2/3.
3. **Playlist ID** — `siteSettings.mandatoryPlaylistId` field added to spec but not yet in any schema. Will add in Phase 2.
4. **No `post` type** — Deferred per spec (optional). Omitted for now.

---

## 6. Critical Items Blocking Phase B (Deploy)

| Item | Must Fix Before Deploy |
|------|------------------------|
| Sanity project created, CORS set to Netlify URL + `/studio` | Yes |
| Sanity webhook → `/api/revalidate` with secret | Yes |
| Resend domain verified (or `INQUIRY_TO_EMAIL` = Resend account email as fallback) | Yes |
| Turnstile hostname allowed | Yes |
| GitHub Actions secrets (`CRON_SECRET`, site URL) set | Yes |
| All env vars documented and set in Netlify | Yes |

---

## 7. Next Steps

1. **Phase 2:** Install Sanity, create all schema types, embed Studio, seed coach's verbatim content.
2. **Phase 3:** Build every public page from Sanity data; wire revalidation.
3. **Phase 4:** Inquiry flow with all validation, Turnstile, Resend (coach + auto-reply with playlist).
4. **Phase 5:** YouTube sync via GitHub Actions.
5. **Phase B:** Deploy to Netlify, configure all integrations.
6. **Phase C/D:** Hardening + handover docs.

---

**Ready for Phase 2.** No critical blockers in the current repo.