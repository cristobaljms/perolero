import React from "react";
import { ListingCard } from "./listing-card";
import Link from "next/link";
import { getRecentListings } from "@/services/server/listing";

export default async function RecentListings() {
  const listings = await getRecentListings();
  console.log(listings);
  return (
    <section className="mt-10 mb-5">
      <h2 className="text-xl font-semibold mb-5 flex items-center">
        Últimas publicaciones
        <Link
          href="/categorias"
          className="ml-4 text-sm text-muted-foreground border border-muted-foreground rounded-md px-2 py-1"
        >
          Ver categorías
        </Link>
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  );
}
