import SidebarBanner from '../adsense/banners/SidebarBanner';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';

export default function RightBanner() {
  return (
    <SidebarBanner 
      adSlot={ADSENSE_CONFIG.adSlots.sidebarRight} 
      className="sticky top-24"
    />
  );
}