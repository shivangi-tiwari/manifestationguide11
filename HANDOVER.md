# Project handover

This checklist is for transferring operational control of the Manifestation Guide website to the coach. It contains no credentials. Keep all secrets in the providers' protected settings, never in this repository, chat, or a published document.

## URLs and repository

- Public website: `<SITE_URL>` — replace with the confirmed production origin.
- Sanity Studio: `<SITE_URL>/studio`.
- Source repository: `shivangi-tiwari/manifestationguide11` (private GitHub repository).
- Hosting: Netlify site connected to the repository.
- Scheduled sync: GitHub Actions workflow at `.github/workflows/youtube-sync.yml`.

## Account ownership checklist

Complete and verify each transfer with the coach before considering the handover finished:

- [ ] Coach has owner/admin access to the GitHub organization or repository and can manage repository members.
- [ ] Coach has owner access to the Netlify team/site and controls billing and environment variables.
- [ ] Coach has owner access to the Sanity organization/project and can manage users, datasets, and API tokens.
- [ ] Coach controls the domain registrar and DNS account for the production domain.
- [ ] Coach controls the email provider account and verified sender address used by Resend.
- [ ] Coach controls the Cloudflare Turnstile account and can rotate the site and secret keys.
- [ ] Coach controls the YouTube channel/API project and can rotate the YouTube Data API key.
- [ ] Coach can manage GitHub Actions secrets and pause or manually run the sync workflow.
- [ ] A second trusted owner is configured where each provider supports it, with multi-factor authentication enabled.
- [ ] The actual public URL is recorded above and configured as `NEXT_PUBLIC_SITE_URL` in Netlify and `SITE_URL` in GitHub Actions.
- [ ] The coach can sign in to `<SITE_URL>/studio`, edit and publish a test setting, and confirm the change appears on the public site.
- [ ] The coach has received [COACH-GUIDE.md](./COACH-GUIDE.md), [DEPLOY.md](./DEPLOY.md), and the recovery steps below.

Do not mark an account transfer complete based only on receiving a token. Confirm that the coach can sign in, manage access, and rotate credentials herself.

## Provider configuration

Configure the required values in Netlify's protected environment-variable settings. Configure `SITE_URL` and `CRON_SECRET` in GitHub Actions secrets. Use `.env.example` as the list of variable names; it intentionally contains no working values. See [DEPLOY.md](./DEPLOY.md) for variable purposes and deployment steps.

Never expose server-only values through `NEXT_PUBLIC_` variables. Do not paste credentials into commits, issue trackers, documentation, or support messages.

## Ongoing maintenance

- Review Netlify deploys and function logs after releases and inquiry tests.
- Review the scheduled YouTube sync workflow for failures and unexpected document updates.
- Keep the inquiry recipient and verified sender current in protected environment settings.
- Review Sanity users and provider access periodically; remove access that is no longer needed.
- Keep an independent copy of important Sanity content and configuration. A hosting rollback does not roll back Sanity documents.
- Rotate a secret immediately if it may have been exposed, then update the provider configuration and redeploy or rerun the dependent workflow.

## Recovery

1. For a broken deployment, restore the previous successful Netlify deploy and inspect the failing build before redeploying.
2. For an incorrect YouTube sync update, pause the GitHub Actions schedule, restore desired values in Sanity, then review the sync behavior before resuming.
3. For an exposed credential, revoke it at its provider, create a replacement, update the protected environment setting, and verify the dependent service.
4. For a Sanity content mistake, restore the affected document from the provider's history or the maintained content backup. A code deployment rollback does not restore CMS content.

## Handover status

The repository does not establish that provider account ownership, production deployment, or the real site URL have been transferred. Complete the checklist with the coach and record the confirmed URL and date outside this source-controlled document if doing so would disclose private operational details.
