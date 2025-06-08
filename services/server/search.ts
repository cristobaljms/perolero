'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Listing } from '@/types/listing-types'
import { COMMON_LISTING_FIELDS } from '@/utils/constants'

export async function searchListings(searchTerm: string):Promise<Listing[]> {
  const supabase = await createClient()

  if (!searchTerm || searchTerm.trim() === '') {
    // Si el término de búsqueda está vacío, simplemente redirige o devuelve todos los anuncios
    //revalidatePath('/buscar') // O la ruta donde estén tus anuncios
    return []; 
  }

  // console.log("Search Query:", searchTerm); // Para depuración

  const { data: listings, error } = await supabase
    .from('listings')
    .select(COMMON_LISTING_FIELDS)
    .textSearch('search_vector', searchTerm, {
      type: 'plain',
      config: 'spanish'
    })

  if (error) {
    console.error('Error al buscar anuncios:', error);
    return [];
  }

  return listings as unknown as Listing[];
}
