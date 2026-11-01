# Manifestation Guide

The Manifestation Guide website is a single-page Next.js site backed by Sanity Studio. The coach manages site copy, videos, FAQs, packages, written success stories, and inquiries in Sanity. The site does not provide user accounts, checkout, or payment processing.

## Requirements

- Node.js 20 or newer
- npm
- Access to the Sanity project and the environment variables listed in `.env.example`

## Local development

1. Install dependencies with `npm ci`.
2. Copy `.env.example` to `.env.local` and fill in the required local values. Keep `.env.local` private; it is ignored by Git.
3. Start the development server with `npm run dev`.
4. Open `http://localhost:3000`. Sanity Studio is available at `/studio`.

The production build and development server both use `.next`. Stop the development server before running `npm run build`; do not run them concurrently.

## Validation

Run these checks before deployment:

```powershell
npm run lint
npx tsc --noEmit
npm run build
```

There is no automated browser or integration test suite configured yet. The manual checks below exercise the inquiry and video-sync paths without placing secrets in source control or command history.

## Manual inquiry checks

Use a local or staging deployment with Sanity write access, valid Turnstile keys, and a Resend configuration you control. Do not test by sending messages to an unintended recipient.

1. Open the Contact section and submit a valid inquiry after completing Turnstile and accepting Terms & Conditions. Confirm the form reports success, the inquiry appears in Sanity with status `new`, and the configured inbox and visitor email receive their messages.
2. Try an invalid email, a message shorter than the minimum, an unchecked Terms & Conditions box, and an empty/invalid Turnstile response. Each must be rejected without creating an inquiry.
3. Fill the hidden honeypot field in browser developer tools and submit. The action must reject it.
4. Submit six requests from the same IP within one minute. The first five may proceed; the sixth must be rate-limited. The limiter is process-local, so this check only applies to one running server instance.
5. To verify save-before-email behavior, use a staging Resend configuration that deliberately fails. The inquiry should remain saved in Sanity and the server logs should report the email failure.

The inquiry handler is a Server Action, not a public `/api/inquiry` endpoint. Exercise it through the form so the browser, Turnstile, and action are tested together.

## Manual YouTube sync checks

The cron route writes video documents to Sanity and consumes YouTube Data API quota. Run successful syncs only against a staging Sanity dataset unless an intentional production update is planned.

First, verify the route rejects a request without credentials. From PowerShell, with the local server running:

```powershell
Invoke-WebRequest -Method Get -Uri "http://localhost:3000/api/cron/youtube-sync"
```

The expected result is HTTP `401 Unauthorized`. An authenticated staging sync can be triggered without placing the secret in command history or printing it:

```powershell
$secureSecret = Read-Host "Cron secret" -AsSecureString
$secretPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureSecret)
try {
    $cronSecret = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($secretPointer)
    $baseUrl = $env:NEXT_PUBLIC_SITE_URL
    if ([string]::IsNullOrWhiteSpace($baseUrl)) { $baseUrl = "http://localhost:3000" }
    $headers = @{ Authorization = "Bearer $cronSecret" }
    Invoke-RestMethod -Method Get -Uri "$baseUrl/api/cron/youtube-sync" -Headers $headers
}
finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($secretPointer)
}
```

Before running it, ensure the endpoint points to the intended staging deployment; set `NEXT_PUBLIC_SITE_URL` in the current PowerShell session if it is not localhost. Review the JSON response for `created`, `updated`, `errors`, and `durationMs`; then verify the resulting video documents in Studio. The sync does not delete documents. Existing documents are currently updated with the latest title and description, so review the audit findings before running against records with editor-authored text.

The scheduled GitHub Actions workflow can also be started manually from the repository's Actions tab. Confirm the repository secrets are configured and inspect the workflow result before enabling or relying on the schedule.

## Sanity Studio

Studio is mounted at `/studio`. The configuration is in `src/cms/sanity.config.ts`; schemas are in `src/cms/schemaTypes/`. Content changes are revalidated through the Sanity webhook route at `/api/revalidate`.

## Main project paths

- `src/app/page.tsx` — home page data loading
- `src/components/sections/` — home-page sections
- `src/app/actions/inquiry.ts` — validated inquiry Server Action
- `src/app/api/cron/youtube-sync/route.ts` — authenticated YouTube-to-Sanity sync
- `src/lib/sanity/` — Sanity read, write, and image helpers
- `src/cms/` — embedded Studio configuration and schemas
- `ARCHITECTURE.md` — architecture rules and deployment plan
- `AUDIT.md` — current architecture audit and unresolved findings
