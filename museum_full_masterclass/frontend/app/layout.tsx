// app/layout.tsx
// Museum of Impossible Things - Root Layout
import MuseumHeader from '@/components/MuseumHeader';
import MuseumFooter from '@/components/MuseumFooter';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Museum of Impossible Things',
    template: '%s | Museum of Impossible Things',
  },
  description: 'Consciousness-serving AI platform built by Keith Soyka. Celebrating neurodivergent innovation and human-centered technology.',
  keywords: [
    'AI',
    'consciousness',
    'neurodivergent',
    'ADHD',
    'innovation',
    'Museum of Impossible Things',
    'Keith Soyka',
    'GestaltView',
  ],
  authors: [{ name: 'Keith Soyka', url: 'https://keithsoyka.com' }],
  creator: 'Keith Soyka',
  publisher: 'Keith Soyka',
  metadataBase: new URL('https://museum-of-impossible-things.vercel.app'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://museum-of-impossible-things.vercel.app',
    title: 'Museum of Impossible Things',
    description: 'Where consciousness meets technology. Built by Keith Soyka.',
    siteName: 'Museum of Impossible Things',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Museum of Impossible Things',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Museum of Impossible Things',
    description: 'Consciousness-serving AI platform',
    creator: '@keithsoyka',
    images: ['/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {/* ✅ FIXED: Actually render the header */}
          <MuseumHeader />
          
          {/* Main content */}
          <main id="main-content">
            {children}
          </main>
          
          {/* ✅ FIXED: Add footer */}
          <MuseumFooter />
        </div>
      </body>
    </html>
  );
}
