'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  adSlot: string;
  adFormat?: string;
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdBanner({ 
  adSlot, 
  adFormat = 'auto', 
  style = { display: 'block' },
  className = '',
  responsive = true 
}: AdBannerProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Error al cargar el anuncio de AdSense:', error);
    }
  }, []);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
} 