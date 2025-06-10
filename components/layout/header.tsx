import HeadBanner from "../adsense/banners/HeadBanner";
import { ADSENSE_CONFIG } from "@/lib/adsense-config";

export default function Header() {
  return (
    <HeadBanner adSlot={ADSENSE_CONFIG.adSlots.header} /> 
  );
}
