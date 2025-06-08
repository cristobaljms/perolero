"use client";
import { useParams, useSearchParams } from "next/navigation";
import CategoryMenu from "../category-menu";
import Location from "../location";
import { ListingCard } from "./listing-card";
import { useQuery } from "@tanstack/react-query";
import {
  CATEGORY_IDS,
  CATEGORY_TAGS,
  COMMON_LISTING_FIELDS,
} from "@/utils/constants";

export default function ListingCategoryList() {
  const { category } = useParams();
  const searchParams = useSearchParams();
  const location = searchParams.get("location");

  const { data: listings, isLoading } = useQuery({
    queryKey: ["listings", category],
    queryFn: async () => {
      try {
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();

        // Primero consultar todas las categorías
        const { data: categories, error: categoriesError } = await supabase
          .from("categories")
          .select("tag, parent_id, id");

        if (categoriesError) {
          throw new Error("Error al cargar las categorías desde Supabase");
        }

        // Encontrar la categoría actual por tag
        const currentCategory = categories?.find((cat) => cat.tag === category);

        if (!currentCategory) {
          throw new Error("Categoría no encontrada");
        }

        // Ahora consultar los listings usando el ID de la categoría encontrada
        let query = supabase
          .from("listings")
          .select(COMMON_LISTING_FIELDS)
          .order("created_at", { ascending: false });

        if (category === CATEGORY_TAGS.INMUEBLES) {
          query = query
            .eq("category_id", 1);
   
        } else if (category === CATEGORY_TAGS.VEHICULOS) {
          query = query
            .eq("category_id", 2)

        } else {
          query = query.eq("category_id", currentCategory.id);
        }

        const { data, error } = await query;

        if (error) {
          throw new Error("Error al cargar los anuncios desde Supabase");
        }

        return data;
      } catch (error) {
        console.error("Error al obtener los anuncios:", error);
        throw error;
      }
    },
  });

  return (
    <div>
      <div className="flex gap-2">
        <div className="flex min-w-[250px]">
          <div className="flex-1">
            <CategoryMenu />
            <Location location={location} />
          </div>
        </div>
        <div className="flex-1 ">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {listings?.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
