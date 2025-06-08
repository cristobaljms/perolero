import { Listing } from "@/types/listing-types";
import { baseServerQuery } from "./base";
import { COMMON_LISTING_FIELDS } from "@/utils/constants";

export async function getAllListings(): Promise<Listing[]> {
  return baseServerQuery((supabase) => 
    supabase
      .from("listings")
      .select(COMMON_LISTING_FIELDS)
  ) as Promise<Listing[]>;
}
export async function getRecentListings(limit = 10): Promise<Listing[]> {
  return baseServerQuery((supabase) => 
    supabase
      .from("listings")
      .select(COMMON_LISTING_FIELDS)
      .limit(limit)
      .order("created_at", { ascending: false })
  ) as Promise<Listing[]>;
}

export async function getListingById(id: string): Promise<Listing | null> {
  const results = await baseServerQuery((supabase) => 
    supabase
      .from("listings")
      .select(COMMON_LISTING_FIELDS)
      .eq("id", parseInt(id))
      .limit(1)
  ) as Listing[];
  
  return results.length > 0 ? results[0] : null;
} 

export async function getRecentListingsByCategory(category: Number, limit = 10): Promise<Listing[]> {
  return baseServerQuery((supabase) => 
    supabase
      .from("listings")
      .select(COMMON_LISTING_FIELDS)
      .eq("category_id", category)
      .limit(limit)
      .order("created_at", { ascending: false })
  ) as Promise<Listing[]>;
}