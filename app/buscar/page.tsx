import CategoryMenu from "@/components/category-menu";
import Location from "@/components/location";
import { ListingCard } from "@/components/listings/listing-card";
import { getAllListings } from "@/services/server/listing";
import { searchListings } from "@/services/server/search";
import { Listing } from "@/types/listing-types";

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: { q: string; location: string };
}) {
  const search = searchParams.q;
  const location = searchParams.location;
  let listings: Listing[] = [];

  console.log(search, location);

  if (search) {
    listings = await searchListings(search);
    console.log(listings);
    // listings = result.data as Listing[];
    // error = result.error;
  } else {
    listings = await getAllListings();

    console.log(listings);
    // anuncios = result.data as Listing[];
    // error = result.error;
  }

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex min-w-[250px]">
          <div className="flex-1">
            <CategoryMenu />
            <Location location={location} />
          </div>
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {listings?.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
