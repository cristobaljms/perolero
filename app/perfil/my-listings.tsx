"use client";
import { ListingCard } from "@/components/listings/listing-card";
import { COMMON_LISTING_FIELDS } from "@/utils/constants";
import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

async function getListings(user_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(COMMON_LISTING_FIELDS)
    .eq("user_id", user_id);
  if (error) throw error;
  return data;
}

const MyListings = ({ user_id }: { user_id: string }) => {
  const { data: listings } = useQuery({
    queryKey: ["listings"],
    queryFn: () => getListings(user_id),
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
      {listings?.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
};

export default MyListings;
