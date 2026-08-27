import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DM_Sans, IBM_Plex_Mono } from 'next/font/google'
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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://eisenberg-pocock-warner-wolfe-berman.onrender.com')

const TITLE = 'Eisenberg, Pocock, Warner, Wolfe & Berman — Rolling 4-Week Intelligence'
const DESCRIPTION =
  'Eisenberg, Pocock, Warner, Wolfe & Berman: a rolling four-week window on five founder feeds worth the week. Repos reviewed with crossovers cut, skills covered, the ACP funnel simulator, technical core inventory, founder toolbox, and a 13-slide exportable deck. Built by Blue Collar Appz Co.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  generator: 'v0.app',
  keywords: [
    'founder intelligence',
    'ACP funnel',
    'startup skills',
    'rolling four-week',
    'Blue Collar Appz',
    'Eisenberg',
    'Pocock',
    'Warner',
    'Wolfe',
    'Berman',
  ],
  authors: [{ name: 'Blue Collar Appz Co.' }],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    siteName: 'Eisenberg, Pocock, Warner, Wolfe & Berman',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
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
        {children}
        {/* Vercel sets VERCEL=1 during its builds; on Render the script would 404. */}
        {process.env.NODE_ENV === 'production' && process.env.VERCEL === '1' && <Analytics />}
      </body>
    </html>
  )
}
