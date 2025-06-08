import CategoryMenu from "@/components/category-menu";
import Location from "@/components/location";
import { ListingCard } from "@/components/listings/listing-card";
import { getAllListings, searchListings } from "@/services/server/listing";
import { Listing } from "@/types/listing-types";
import { getCategory } from "@/utils/utils";

type AnunciosPageProps = {
  searchParams: Promise<{ category: string, location: string, q: string }>
};

const parseLocation = (location: string) => {
  if (!location) return { state_id_number: null, city_id_number: null };
  
  const [state_id, city_id] = location.split("-");
  const state_id_number = state_id ? Number(state_id) : null;
  const city_id_number = city_id ? Number(city_id) : null;
  
  return { state_id_number, city_id_number };
};

const getListingsForParams = async (
  category: string,
  location: string,
  search: string
): Promise<Listing[]> => {
  if (!category && !location && !search) {
    return await getAllListings();
  }

  const category_id = category ? getCategory(category)?.id ?? null : null;
  const { state_id_number, city_id_number } = parseLocation(location);

  return await searchListings(
    category_id,
    state_id_number,
    city_id_number,
    search || null
  );
};

export default async function AnunciosPage({
  searchParams,
}: AnunciosPageProps) {
  const { category, location, q: search } = await searchParams;

  const listings = await getListingsForParams(category, location, search);

  return (
    <div>
      <div className="flex gap-2">
        <aside className="flex min-w-[250px]">
          <div className="flex-1">
            <CategoryMenu />
            <Location location={location} />
          </div>
        </aside>
        
        <main className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
