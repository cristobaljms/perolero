import * as React from "react";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Listing, ProductListing, VehicleListing } from "@/types/listing-types";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const description = listing.description || 
                     (listing as ProductListing).product_title || 
                     (listing as VehicleListing).vehicle_brand || 
                     'Sin descripción';

  return (
    <Link href={`/a/${listing.id}`} className="block w-full h-full">
      <Card className="flex flex-col w-full h-full overflow-hidden transition-all hover:shadow-md border-0 rounded-lg">
        <div className="relative w-full aspect-square">
          {listing.images && listing.images.length > 0 ? (
            <Image
              className="object-cover rounded-t-lg"
              src={listing.images[0].image_url}
              alt={description}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={false}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-t-lg flex items-center justify-center">
              <p className="text-gray-500">Sin imagen</p>
            </div>
          )}
        </div>
        <div className="p-3 flex flex-col gap-1">
          <p className="text-lg font-bold">
            {listing.price?.toLocaleString("es-ES")} $
          </p>
          <h3 className="line-clamp-1 text-base font-medium">
            {description}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {listing.location}
          </p>
        </div>
      </Card>
    </Link>
  );
}
