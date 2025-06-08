import { createClient } from "@/utils/supabase/client";
import { Listing } from "@/types/listing-types";
import { COMMON_LISTING_FIELDS } from "@/utils/constants";

// Ejemplo de función para el cliente
export async function searchListings(query: string): Promise<Listing[]> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("listings")
    .select(`${COMMON_LISTING_FIELDS}`)
    .textSearch('description', query)
    .limit(20);
    
  if (error) {
    console.error("Error al buscar anuncios:", error);
    throw error;
  }
  
  return data as Listing[];
} 

export async function getListing(listing_id: string): Promise<Listing> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(`${COMMON_LISTING_FIELDS}`)
    .eq("id", listing_id)
    .single();

  if (error) throw error;
  return data;
}