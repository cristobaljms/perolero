import Header from "@/components/layout/header";
import PropertyListings from "../components/listings/property-listing";
import VehicleListings from "../components/listings/vehicle-listing";
import MostPopularCategories from "@/components/most-popular-categories";
import RecentListings from "@/components/listings/recent-listing";
import InContentBanner from "@/components/adsense/banners/InContentBanner";
import { ADSENSE_CONFIG } from "@/lib/adsense-config";

export default async function Home() {
  return (
    <div className="max-w-5xl mx-auto px-3">
      <Header />
      <MostPopularCategories />
      <PropertyListings />
      <InContentBanner adSlot={ADSENSE_CONFIG.adSlots.inContent1} />
      <VehicleListings /> 
      <InContentBanner adSlot={ADSENSE_CONFIG.adSlots.inContent2} />
      <RecentListings />
      <InContentBanner adSlot={ADSENSE_CONFIG.adSlots.inContent3} />
    </div>
  );
}
