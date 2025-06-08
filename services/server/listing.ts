import { Listing } from "@/types/listing-types";
import { baseServerQuery } from "./base";
import { COMMON_LISTING_FIELDS } from "@/utils/constants";
import { createClient } from "@/utils/supabase/server";

export async function getAllListings(): Promise<Listing[]> {
  return baseServerQuery((supabase) =>
    supabase.from("listings").select(COMMON_LISTING_FIELDS)
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
  const results = (await baseServerQuery((supabase) =>
    supabase
      .from("listings")
      .select(COMMON_LISTING_FIELDS)
      .eq("id", parseInt(id))
      .limit(1)
  )) as Listing[];

  return results.length > 0 ? results[0] : null;
}

export async function getRecentListingsByCategory(
  category: Number,
  limit = 10
): Promise<Listing[]> {
  return baseServerQuery((supabase) =>
    supabase
      .from("listings")
      .select(COMMON_LISTING_FIELDS)
      .eq("category_id", category)
      .limit(limit)
      .order("created_at", { ascending: false })
  ) as Promise<Listing[]>;
}

export async function searchListings(
  category: number | null,
  state_id: number | null,
  city_id: number | null,
  searchTerm: string | null
): Promise<Listing[]> {
  const supabase = await createClient();
  const query = supabase.from("listings").select(COMMON_LISTING_FIELDS);

  if (category) {
    query.eq("category_id", category);
  }
  if (state_id) {
    query.eq("state_id", state_id);
  }
  if (city_id) {
    query.eq("city_id", city_id);
  }
  if (searchTerm) {
    query.textSearch("search_vector", searchTerm, {
      type: "plain",
      config: "spanish",
    });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data as Listing[];
}
