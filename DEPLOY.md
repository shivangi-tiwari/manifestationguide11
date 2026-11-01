# Deployment

## Netlify

1. Push the repository to its private GitHub remote and create a Netlify site connected to that repository.
2. Select the production branch. `netlify.toml` sets `npm run build`, Node.js 20, and the official Next.js runtime plugin.
3. Add the environment variables from the table below in Netlify site settings for the production context. Add the same variables to deploy previews only when preview builds should access the corresponding staging services.
4. Deploy and wait for the build to complete. Set `NEXT_PUBLIC_SITE_URL` to the canonical public origin before the production build so metadata and links use the deployed address.
5. Add the deployed site origin and `http://localhost:3000` to the Sanity project's CORS origins if Studio or browser-side Sanity requests need them.
6. Open `/`, `/studio`, and `/terms` on the deployed site. Submit a controlled inquiry using the configured Turnstile and Resend services, and verify that the document appears in Sanity. Do not trigger a successful YouTube sync against production until its planned document updates have been reviewed.

The Sanity dataset must be accessible to the site. Published reads can use the configured public dataset; a read token is only needed for server-side draft/preview reads. Keep write tokens, email credentials, verification secrets, and API keys in the host's encrypted environment settings, never in the repository or a `NEXT_PUBLIC_` variable.

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Netlify | Canonical deployed origin used for metadata. |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Netlify | Sanity project identifier used by the app and Studio. |
| `NEXT_PUBLIC_SANITY_DATASET` | Netlify | Dataset name, normally `production`. |
| `SANITY_API_READ_TOKEN` | Netlify, optional | Server-side access to drafts or other protected reads. |
| `SANITY_API_WRITE_TOKEN` | Netlify | Server-only write access for inquiries and video sync. |
| `SANITY_REVALIDATE_SECRET` | Netlify | Protects `/api/revalidate`. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Netlify | Public Turnstile widget key used by the inquiry form. |
| `TURNSTILE_SECRET_KEY` | Netlify | Server-side Turnstile verification; inquiry submission fails closed without it. |
| `RESEND_API_KEY` | Netlify | Sends inquiry notifications and visitor acknowledgements. |
| `INQUIRY_TO_EMAIL` | Netlify | Inbox that receives inquiries. |
| `INQUIRY_FROM_EMAIL` | Netlify | Verified sender address for inquiry email. |
| `YOUTUBE_CHANNEL_ID` | Netlify | Channel used to load playlists and sync videos. |
| `YOUTUBE_API_KEY` | Netlify | Server-side YouTube Data API access. |
| `CRON_SECRET` | Netlify and GitHub Actions | Authorizes the scheduled sync request. Use the same value in both places. |
| `GOOGLE_SITE_VERIFICATION` | Netlify, optional | Google Search Console verification value. |
| `SITE_URL` | GitHub Actions secret | Base URL of the deployed site called by the sync workflow. |

Use `.env.example` as the local variable-name reference. Do not copy secret values into it.

## GitHub Actions video sync

The workflow at `.github/workflows/youtube-sync.yml` runs daily at 03:00 UTC and supports manual dispatch. In GitHub repository **Settings → Secrets and variables → Actions**, add:

- `SITE_URL`: the deployed site's base URL, without a path.
- `CRON_SECRET`: the same secret configured in Netlify.

The workflow calls `/api/cron/youtube-sync` and prints the JSON response without printing the secret. A successful call writes to Sanity; use a staging deployment and dataset when validating changes. Review `created`, `updated`, and `errors` in each run. The current sync updates existing video titles and descriptions, so do not run it against editor-authored text without first reviewing the open audit finding in `AUDIT.md`.

## Revalidation

`/api/revalidate` requires `SANITY_REVALIDATE_SECRET` and invalidates the Sanity cache tag. Configure a Sanity webhook to call the route when published content changes. The current route accepts its secret in a query parameter; URLs can be retained in request logs, so restrict access to logs and do not paste secret-bearing URLs into tickets or chat.

## Rollback and recovery

- Use Netlify's deploy list to restore the previous successful deploy.
- A deployment rollback does not revert Sanity content or inquiry documents.
- If a sync run changed a video unexpectedly, pause the GitHub Actions schedule, restore the desired document values in Sanity, and review `AUDIT.md` before running the sync again.
- Rotate a compromised API key or token at its provider, then update the corresponding host secret and redeploy. Never commit the replacement value.
