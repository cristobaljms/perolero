import { createClient } from "@/utils/supabase/server";
import { createClient as createClientClient } from "@/utils/supabase/client";
import {
  PropertyListing,
  VehicleListing,
  ProductListing,
} from "@/types/listing-types";
import { Listing } from "@/types/listing-types";

export async function getPropertyListings(): Promise<PropertyListing[]> {
  const supabase = await createClient();

  const { data: listings, error } = await supabase
    .from("listings")
    .select(
      `
        id,
        property_contract_type,
        price,
        location,
        description,
        created_at,
        category:categories (
          id,
          name,
          tag,
          parent_id
        ),
        user:users (
          id,
          full_name,
          avatar_url,
          email
        ),
        images:listing_images (
          id,
          image_url,
          position
        )
      `
    )
    .limit(6)
    .eq("category_id", 1)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener los anuncios:", error);
    throw error;
  }

  return listings as PropertyListing[];
}

export async function getProductListings(): Promise<ProductListing[]> {
  const supabase = await createClient();

  const { data: listings, error } = await supabase
    .from("listings")
    .select(
      `
        id,
        product_title,
        price,
        location,
        description,
        created_at,
        product_state,
        category:categories (
          id,
          name,
          tag,
          parent_id
        ),
        user:users (
          id,
          full_name,
          avatar_url,
          email
        ),
        images:listing_images (
          id,
          image_url,
          position
        )
      `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener los anuncios:", error);
    throw error;
  }

  return listings as ProductListing[];
}

export async function getVehicleListings(): Promise<VehicleListing[]> {
  const supabase = await createClient();

  const { data: listings, error } = await supabase
    .from("listings")
    .select(
      `
        id,
        price,
        location,
        description,
        created_at,
        vehicle_brand,
        vehicle_model,
        vehicle_year,
        category:categories (
          id,
          name,
          tag,
          parent_id
        ),
        user:users (
          id,
          full_name,
          avatar_url,
          email
        ),
        images:listing_images (
          id,
          image_url,
          position
        )
      `
    )
    .limit(6)
    .eq("category_id", 2)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener los anuncios:", error);
    throw error;
  }

  return listings as VehicleListing[];
}

export async function getRecentListings(): Promise<Listing[]> {
  const supabase = await createClient();

  const { data: listings, error } = await supabase
    .from("listings")
    .select(
      `
        *,
        category:categories (
          id,
          name,
          tag,
          parent_id
        ),
        user:users (
          id,
          full_name,
          avatar_url,
          email
        ),
        images:listing_images (
          id,
          image_url,
          position
        )
      `
    )
    .limit(10)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al obtener los anuncios:", error);
    throw error;
  }

  return listings as Listing[];
}

export async function getListing(listing_id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(
      `
      *,
      category:categories (
        id,
        name,
        tag,
        parent_id
      ),
      user:users (
        id,
        full_name,
        avatar_url,
        email
      ),
      images:listing_images (
        id,
        image_url,
        position
      )
    `
    )
    .eq("id", parseInt(listing_id));
  if (error) throw error;
  return data;
}

