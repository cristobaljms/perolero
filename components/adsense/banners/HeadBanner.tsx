import AdBanner from '../AdBanner';

interface HeadBannerProps {
  adSlot: string;
  className?: string;
}

export default function HeadBanner({ adSlot, className = '' }: HeadBannerProps) {
  return (
    <div className={`my-8 flex justify-center ${className} bg-blue-500`}>
      <AdBanner
        adSlot={adSlot}
        adFormat="rectangle"
        style={{ 
          display: 'block',
          width: '336px',
          height: '280px'
        }}
        responsive={false}
      />
    </div>
  );
} 