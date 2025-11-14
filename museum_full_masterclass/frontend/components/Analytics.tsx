// components/Analytics.tsx
'use client';
import Script from 'next/script';

export default function Analytics() {
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_ID;
  return umamiId ? (
    <Script
      async
      src={`https://analytics.umami.is/script.js`}
      data-website-id={umamiId}
      strategy="afterInteractive"
    />
  ) : null;
}
