import React from "react";
import { ListingCard } from "./listing-card";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getRecentListingsByCategory } from "@/services/server/listing";
import { CATEGORIES } from "@/utils/constants";

export default async function PropertyListings() {
  const listings = await getRecentListingsByCategory(CATEGORIES.PROPERTY);

  return (
    <section className="mb-5">
      <h2 className="text-xl font-semibold mb-5 flex items-center">
        Inmuebles
        <Link
          href="/inmuebles"
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
            <CarouselItem key={listing.id} className="basis-1/5">
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
