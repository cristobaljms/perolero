import Header from "@/components/layout/header";
import PropertyListings from "../components/listings/property-listing";
import VehicleListings from "../components/listings/vehicle-listing";
import MostPopularCategories from "@/components/most-popular-categories";
import RecentListings from "@/components/listings/recent-listing";
import MiddleBanner from "@/components/banners/middle-banner";
export default async function Home() {
  return (
    <div className="max-w-5xl mx-auto px-3">
      <Header />
      <MostPopularCategories />
      <PropertyListings />
      <MiddleBanner />
      <VehicleListings />
      <MiddleBanner />
      <RecentListings />
      <MiddleBanner />
    </div>
  );
}
