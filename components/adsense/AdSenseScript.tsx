'use client';

import Script from 'next/script';

interface AdSenseScriptProps {
  adSenseId: string;
}

export default function AdSenseScript({ adSenseId }: AdSenseScriptProps) {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSenseId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
} 