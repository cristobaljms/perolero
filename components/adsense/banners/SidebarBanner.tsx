import AdBanner from '../AdBanner';

interface SidebarBannerProps {
  adSlot: string;
  className?: string;
}

export default function SidebarBanner({ adSlot, className = '' }: SidebarBannerProps) {
  return (
    <AdBanner
      adSlot={adSlot}
      adFormat="vertical"
      className={`hidden lg:block ${className} bg-green-500`}
      style={{ 
        display: 'block',
        width: '160px',
        height: '600px',
        maxHeight: '600px'
      }}
      responsive={false}
    />
  );
} 