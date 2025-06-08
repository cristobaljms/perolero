"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { CATEGORIES } from "@/utils/constants";
import { getListing } from "@/services/client";

export default function EditListingForm({ user_id }: { user_id: string }) {
  const { listing_id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["listing", listing_id],
    queryFn: () => getListing(listing_id as string),
  });

  const router = useRouter();

  if (data && data.user.id !== user_id) {
    router.push("/");
    return null;
  }

  if (isLoading) {
    return <Skeleton className="w-[100px] h-[20px] rounded-full" />;
  }

  if (data && data.category.id === CATEGORIES.PROPERTY) {
    return <div>EditListingPropertyForm</div>;
  }

  if (data && data.category.id === CATEGORIES.VEHICLE) {
    return <div>EditVehicleForm</div>;
  }

  if (data && data.category.id === CATEGORIES.JOB) {
    return <div>EditListingJobForm</div>;
  }

  return <div>EditListingProductForm</div>;
}
