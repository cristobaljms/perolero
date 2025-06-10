import AdBanner from '../AdBanner';

interface InContentBannerProps {
  adSlot: string;
  className?: string;
}

export default function InContentBanner({ adSlot, className = '' }: InContentBannerProps) {
  return (
    <AdBanner
      adSlot={adSlot}
      adFormat="horizontal"
      className={`w-full max-w-4xl mx-auto my-4 ${className} bg-red-500`}
      style={{ 
        display: 'block',
        width: '100%',
        height: '90px'
      }}
    />
  );
} 