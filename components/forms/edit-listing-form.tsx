"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Listing } from "@/types/listing-types";
import { Skeleton } from "../ui/skeleton";
import { CATEGORIES } from "@/utils/constants";
import EditListingPropertyForm from "./edit-listing-property-form";

const getListing = async (listing_id: string): Promise<Listing> => {
    const supabase = await createClient();
    const { data: listing, error } = await supabase
      .from("listings")
      .select(
        `
        *,
        category:categories (
          id,
          name,
          parent_id
        ),
        user:users (
          id,
          full_name,
          avatar_url,
          email,
          phone,
          phone_verified
        ),
        images:listing_images (
          id,
          image_url,
          position
        ),
        location:cities (
          *,
          state:states (
            id,
            name
          )
        )
      `
      )
      .eq("id", parseInt(listing_id))
      .single();
  
    if (error) throw error;
    return listing;
  };
  
export default function EditListingForm({ user_id }: { user_id: string }) {
  const { listing_id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["listing", listing_id],
    queryFn: () => getListing(listing_id as string),
  });

  const router = useRouter();

  if (data && data.user.id !== user_id) {
    router.push('/');
    return null;
  }

  if (isLoading) {
    return <Skeleton className="w-[100px] h-[20px] rounded-full" />
  }

  if (data && data.category.id === CATEGORIES.PROPERTY) {
    return <EditListingPropertyForm data={data as Listing} />;
  }

  if (data && data?.category.id === CATEGORIES.VEHICLE) {
    return <div>EditVehicleForm</div>;
  }

  return <div>Formulario por defecto</div>;
}
