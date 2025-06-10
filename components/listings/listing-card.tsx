import * as React from "react";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Listing } from "@/types/listing-types";
import { CATEGORIES } from "@/utils/constants";

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard = React.memo(function ListingCard({ listing }: ListingCardProps) {
  // Remover console.log en producción para evitar exposición de datos
  const isJobAndRemote = listing.category.id === CATEGORIES.JOB && listing.attributes?.find(attribute => attribute.name === "remote")?.value === "Remoto";

  return (
    <Link href={`/a/${listing.id}`} className="block w-full h-full">
      <Card className="flex flex-col w-full h-full overflow-hidden transition-all border-0 rounded-lg">
        <div className="relative w-full aspect-square">
          {listing.images && listing.images.length > 0 ? (
            <Image
              className="object-cover rounded-lg"
              src={listing.images[0].image_url}
              alt={listing.description || "Sin descripción"}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={false}
            />
          ) : (
            <div className="w-full h-full rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Sin imagen</p>
            </div>
          )}
        </div>
        <div className="pt-1 bg-gray-100 flex flex-col">
          <p className="text-lg font-bold">
            {listing.price?.toLocaleString("es-ES")} $
          </p>
          <h3 className="line-clamp-1 text-base">
            {listing.description || "Sin descripción"}
          </h3>

          {isJobAndRemote && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              Remoto
            </p>
          )}
          {(listing.state_id || listing.city_id) && !isJobAndRemote && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {listing.state_id?.name}, {listing.city_id?.name}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
});
