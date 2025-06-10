"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { CATEGORIES } from "@/utils/constants";
import { getListing } from "@/services/client";
import EditListingPropertyForm from "./edit-listing-property-form";
import EditListingVehicleForm from "./edit-listing-vehicle-form";
import EditListingJobForm from "./edit-listing-job-form";
import EditListingProductForm from "./edit-listing-product-form";

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
    return <EditListingPropertyForm listing={data} />;
  }

  if (data && data.category.id === CATEGORIES.VEHICLE) {
    return <EditListingVehicleForm listing={data} />;
  }

  if (data && data.category.id === CATEGORIES.JOB) {
    return <EditListingJobForm listing={data} />;
  }

  if (data) {
    return <EditListingProductForm listing={data} />;
  }

  return <div>No se encontró el formulario</div>;
}
