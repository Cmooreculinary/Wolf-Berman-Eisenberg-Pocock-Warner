/**
 * Two deploy targets share this config:
 *
 *   - Vercel / v0 preview — the default. Next.js serves the app and applies
 *     the security headers below itself.
 *   - Render static site — set STATIC_EXPORT=true. Next.js writes plain HTML
 *     to `out/` and Render serves it. There is no server to run headers(), so
 *     the same headers are declared in render.yaml instead.
 *
 * Every route in this app is prerendered, so the export loses nothing.
 */
const staticExport = process.env.STATIC_EXPORT === 'true'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  ...(staticExport
    ? { output: 'export' }
    : {
        async headers() {
          return [
            {
              source: '/:path*',
              headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
                {
                  key: 'Permissions-Policy',
                  value: 'camera=(), microphone=(), geolocation=()',
                },
              ],
            },
          ]
        },
      }),
}

export default nextConfig
