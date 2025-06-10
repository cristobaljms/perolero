import SidebarBanner from '../adsense/banners/SidebarBanner';
import { ADSENSE_CONFIG } from '@/lib/adsense-config';

export default function LeftBanner() {
  return (
    <SidebarBanner 
      adSlot={ADSENSE_CONFIG.adSlots.sidebarLeft} 
      className="sticky top-24"
    />
  );
}