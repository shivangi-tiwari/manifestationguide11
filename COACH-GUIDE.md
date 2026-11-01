# Coach guide

The site content is managed in Sanity Studio. Once the site is deployed, open **`<SITE_URL>/studio`** and sign in with an account that has editor access to the Sanity project. Replace `<SITE_URL>` with the site's actual public origin; the live URL is intentionally not guessed here.

## Editing the site

1. Open a document from the left-hand Studio menu.
2. Edit the fields and publish the document to make changes public. Unpublished changes are not shown on the site.
3. If a change does not appear promptly, refresh the page after the Sanity revalidation webhook runs.

### Site Settings

Use the **Site Settings** singleton for global copy and links:

- Site title, tagline, hero heading and subheading, and About summary.
- Optional About subtitle, Contact intro, and Success Stories subtitle. Leave an optional field empty to hide it.
- Contact email, Instagram handle/URL, YouTube URL and channel ID.
- Must-Watch playlist URL and ID, footer text, disclaimer, and optional developer credit.
- Search and sharing title, description, and social-sharing image.
- Optional section illustrations and the Terms & Conditions Portable Text content.

Avoid putting API keys, passwords, or other secrets in Site Settings. Service credentials belong only in the hosting provider's environment settings.

### Pages, packages, FAQs, and written stories

- **Pages:** edit the page title, slug, body, and SEO fields. The Terms & Conditions content displayed by the site is managed in Site Settings.
- **Packages:** edit the package details and display order. Only published packages appear publicly.
- **FAQs:** edit the question, answer, and order.
- **Written Success Stories:** add or edit written stories and publish them when ready. Unpublished stories stay off the public site.

### Videos

- The **Teaching Videos** and **Success Story Videos** lists are views of the same video documents; they are separated by the **Show in Success stories** setting.
- Use **Hidden** to remove a video from the public site without deleting its Sanity document.
- Use **Display Order** to control ordering where the site uses that field.
- Synced YouTube videos refresh automatically when the scheduled sync runs. **The sync replaces a video's title and description with the current YouTube values.** Edit those values on YouTube if they should remain changed.
- The sync's initial title-based story detection only runs when a video document is first created. You can change **Show in Success stories** in Studio afterward.
- The site does not delete Sanity video documents when videos disappear from YouTube.

For a manual sync, deployment setup, and testing guidance, see [DEPLOY.md](./DEPLOY.md) and [README.md](./README.md).

### Inquiries

New form submissions appear in **Inquiries → New**. Open a record to review its read-only submission details and update **Status** to **Replied** or **Closed** as appropriate. Do not copy inquiry details into public content.

## If something goes wrong

- If Studio cannot open, confirm the account has access to the Sanity project and that the deployment has the correct public Sanity project ID and dataset.
- If an edit is not visible, confirm it was published and allow the Sanity webhook/cache revalidation to complete.
- If inquiry emails stop, check the Resend service and its environment configuration. Submitted inquiries are saved to Sanity before email is attempted.
- If videos stop syncing, ask the technical maintainer to review the GitHub Actions run and Netlify function logs. Avoid triggering a production sync repeatedly; it uses YouTube API quota and updates synced titles/descriptions.
