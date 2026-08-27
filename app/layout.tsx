import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DM_Sans, IBM_Plex_Mono } from 'next/font/google'
import { API_BASE, DISCOVERY, LICENSE, PUBLISHER, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absolute } from '@/lib/site'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Eisenberg, Pocock, Warner, Wolfe & Berman — Rolling 4-Week Intelligence',
  description:
    'Eisenberg, Pocock, Warner, Wolfe & Berman: a rolling four-week window on five founder feeds worth the week. Repos reviewed with crossovers cut, skills covered, the ACP funnel simulator, technical core inventory, founder toolbox, and a 13-slide exportable deck. Every view is also a public JSON endpoint. Built by Blue Collar Appz Co.',
  generator: 'v0.app',
  // The page renders client-side; point anything that reads markup at the data.
  alternates: {
    canonical: '/',
    types: { 'application/json': `${API_BASE}/index.json` },
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#141414',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${plexMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        {/*
          The same facts the pages render, in a shape a crawler can read without
          executing the app. Kept in sync by construction: the URLs come from
          lib/site.ts, which is also what generates the files they point at.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Dataset',
              name: SITE_NAME,
              description: SITE_DESCRIPTION,
              url: SITE_URL,
              license: LICENSE.url,
              isAccessibleForFree: true,
              creator: { '@type': 'Organization', name: PUBLISHER.name, url: PUBLISHER.url },
              distribution: [
                {
                  '@type': 'DataDownload',
                  encodingFormat: 'application/json',
                  contentUrl: absolute(`${API_BASE}/dataset.json`),
                  description: 'The full dataset in one file.',
                },
                {
                  '@type': 'DataDownload',
                  encodingFormat: 'application/json',
                  contentUrl: absolute(DISCOVERY.openapi),
                  description: 'OpenAPI 3.1 contract for the individual endpoints.',
                },
              ],
            }),
          }}
        />
        {children}
        {/* Vercel sets VERCEL=1 during its builds; on Render the script would 404. */}
        {process.env.NODE_ENV === 'production' && process.env.VERCEL === '1' && <Analytics />}
      </body>
    </html>
  )
}
