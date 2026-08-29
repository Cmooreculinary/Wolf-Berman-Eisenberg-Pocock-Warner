# Security policy

## Scope

This is a static site. It has no server, no database, no API route, no
authentication, and no user data — `STATIC_EXPORT=true pnpm build` produces
plain HTML and JavaScript that a CDN serves. The realistic attack surface is
therefore limited to the dependency tree and the content of the build output.

## Reporting a vulnerability

Open a [private security advisory][advisory] rather than a public issue.

[advisory]: https://github.com/Cmooreculinary/Wolf-Berman-Eisenberg-Pocock-Warner/security/advisories/new

Please include what you did, what happened, and what you expected. A first
response should come within a week.

## What is already in place

- **No secrets in the repository.** There is nothing to leak: the app reads no
  environment variables at runtime, and `.gitignore` excludes `.env*.local`.
- **Response headers.** `X-Content-Type-Options`, `Referrer-Policy`,
  `Strict-Transport-Security` and `Permissions-Policy` are applied by
  `next.config.mjs` when Next serves the app, and by `render.yaml` when Render
  serves the static export. Changing one without the other is a bug — see
  [RENDER.md](RENDER.md).
- **No third-party runtime scripts.** Vercel Analytics is gated behind
  `VERCEL=1`, so builds for any other host ship no analytics.
- **Outbound links.** Every external link is `rel="noopener noreferrer"`.

## Out of scope

Reports about the *content* of the review log — which repos are listed, how
they are described — are editorial, not security. Open a regular issue.
