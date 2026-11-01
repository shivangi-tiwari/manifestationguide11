# Architecture audit — current repository state

## Scope

This report records the current implementation and validation results after Prompts 1–7. It is an implementation audit, not a penetration test. The requested sync behavior changes outside the original critical-fix scope remain documented rather than changed.

## Current implementation

- Next.js 14 App Router, TypeScript, Tailwind CSS, and an embedded Sanity Studio at `/studio`.
- Sanity Studio registers Site Settings, pages, packages, videos, written success stories, FAQs, and inquiries. Inquiry records are created by the server action; the editor can change their status.
- The home page separates ordinary videos from videos marked `isSuccessStory`; hidden videos are excluded. Written success stories come from published `successStory` documents.
- The inquiry form uses one Server Action with Zod validation, honeypot, Turnstile verification, a five-attempts-per-minute process-local IP limit, Sanity persistence before email, and environment-configured Resend delivery.
- The cron route uses the YouTube Data API and an authorization secret. It does not delete Sanity documents.
- Optional `aboutSubtitle`, `contactIntro`, and `storiesSubtitle` values are read from Site Settings and omitted when empty. Terms & Conditions are the remaining policy content.
- Site metadata, robots, and sitemap routes are configured. `NEXT_PUBLIC_SITE_URL` must be set in the production environment.
- Deployment configuration targets Netlify; the GitHub Actions workflow triggers YouTube sync. See [DEPLOY.md](./DEPLOY.md).

## Known deviations and operational risks

1. **Video text is overwritten by sync.** Existing YouTube-backed video titles and descriptions are replaced with the latest YouTube values. The `category`, `featured`, `hidden`, `isSuccessStory`, and `order` fields are retained. The sync also returns HTTP 500 for fatal upstream errors. These behaviors were documented, not changed.
2. **Inquiry rate limiting is process-local.** It does not coordinate across Netlify instances or deployments, so it is not a distributed rate limiter.
3. **Revalidation secret is in the query string.** `/api/revalidate` accepts `SANITY_REVALIDATE_SECRET` in a query parameter, which can be retained in request logs. Protect those logs and avoid sharing secret-bearing URLs.
4. **Sitemap requires the public origin.** With `NEXT_PUBLIC_SITE_URL` unset, sitemap generation logs a configuration error and returns no sitemap entries. Set it to the canonical production origin before deployment.
5. **Production services still need operator configuration.** Sanity, Turnstile, Resend, YouTube, the cron secret, and the canonical site URL must be configured with the provider-specific values. `.env.example` contains names only.
6. **Studio access requires Sanity authorization.** Build checks do not verify authenticated Studio editing; test the editor with the coach's Sanity account after deployment.

## Validation results

Validated locally:

- `npm run lint` — passed without warnings or errors.
- `npx tsc --noEmit` — passed.
- `npm run build` — passed, with all 16 static pages generated and the YouTube sync route listed as dynamic.
- `git diff --check` — passed; Git reported only line-ending conversion warnings.

The local build environment did not set `NEXT_PUBLIC_SITE_URL`, so the sitemap logged that it could not be generated and emitted no entries. Next also logged its dynamic-server-usage diagnostic while evaluating the request-dependent cron route; the route was correctly classified as dynamic, and the production build completed. These are not treated as a fully configured deployment check.

## Prompt 2 audit outcomes

Items 1–6 were addressed: there is one inquiry path, Sanity image dimensions are typed and derived from asset references, missing Sanity project configuration fails outside the build phase, no server-only credentials are exposed through client imports, obsolete direct dependencies/configuration were not found, and root metadata uses the configured canonical origin with a local fallback.

Items 7–10 were audited. The video sync deviations are listed above; Sanity images use the shared helper; no `@ts-expect-error` or `eslint-disable` comments were found in `src`; and video synchronization uses the official YouTube Data API rather than page scraping.
