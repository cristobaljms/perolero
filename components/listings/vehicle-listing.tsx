import React from "react";
import { getVehicleListings } from "@/services/listing-services";
import { ListingCard } from "./listing-card";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default async function VehicleListings() {
  const listings = await getVehicleListings();

  return (
    <section className="mt-10 mb-5">
      <h2 className="text-2xl font-semibold mb-5 flex items-center">
        Vehículos
        <Link
          href="/vehiculos"
          className="ml-4 text-sm text-muted-foreground border border-muted-foreground rounded-md px-2 py-1"
        >
          Ver más
        </Link>
      </h2>

      <div className="grid lg:hidden grid-cols-2 sm:grid-cols-3 gap-2">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full hidden lg:block"
      >
        <CarouselContent>
          {listings.map((listing) => (
            <CarouselItem
              key={listing.id}
              className="basis-1/5"
            >
              <ListingCard listing={listing} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
