"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import MiddleBanner from "../banners/middle-banner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Listing } from "@/types/listing-types";
import React from "react";

const getListing = async (listing_id: string): Promise<Listing> => {
  const supabase = await createClient();
  const { data: listing, error } = await supabase
    .from("listings")
    .select(
      `
      *,
      category:categories (
        id,
        name
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
    .eq("id", parseInt(listing_id))
    .single();

  if (error) throw error;
  return listing;
};


function ListingInformationVehicle() {
  return (
    <div>
      <h1>Listing Details Vehicle</h1>
    </div>
  );
}

export default function ListingDetails() {
  const { listing_id } = useParams();
  const { data } = useQuery({
    queryKey: ["listing", listing_id],
    queryFn: () => getListing(listing_id as string),
  });
  
  // Añadir estado para controlar la posición actual del carrusel
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const carouselApi = React.useRef(null);
  const [api, setApi] = React.useState<any>(null);

  // Configurar la referencia del API del carrusel
  React.useEffect(() => {
    if (carouselApi.current) {
      setApi(carouselApi.current);
    }
  }, []);

  // Función para cambiar a una imagen específica
  const goToImage = React.useCallback((index: number) => {
    if (api) {
      api.scrollTo(index);
      setCurrentIndex(index);
    }
  }, [api]);

  console.log(data);

  return (
    <div className="max-w-5xl mx-auto px-3">
      <MiddleBanner />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="w-full col-span-1 md:col-span-2">
          <Carousel 
            ref={carouselApi}
            onSelect={(event) => {
              // Extraer el índice del evento o usar un valor predeterminado
              const index = (event.target as any)?.selectedIndex || 0;
              setCurrentIndex(index);
            }}
          >
            <CarouselContent>
              {data?.images?.map((image) => (
                <CarouselItem key={image.id}>
                  <div className="w-full h-[600px]">
                    <Image
                      src={image.image_url}
                      alt={image.image_url}
                      width={500}
                      height={500}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
          </Carousel>
        <div className="mt-4 flex overflow-x-auto gap-2 py-2">
          {data?.images?.map((image, index) => (
            <div 
              key={image.id} 
              className={`relative min-w-[80px] h-[60px] border-2 ${
                index === currentIndex ? 'border-primary' : 'border-transparent'
              } cursor-pointer hover:opacity-80 transition-all`}
              onClick={() => goToImage(index)}
            >
              <Image
                src={image.image_url}
                alt={`Miniatura ${index + 1}`}
                width={80}
                height={60}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        </div>
        <div className="w-full col-span-1 md:col-span-1">
          <div className="p-4">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-primary">{data?.price ? `${data.price.toLocaleString('es-ES')} €` : 'Precio no disponible'}</h2>
              {<p className="text-sm text-muted-foreground">En venta</p>}
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <p className="text-gray-700">{data?.description || 'Sin descripción disponible'}</p>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Información del anunciante</h3>
              {data?.user ? (
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-3">
                    {data.user.avatar_url ? (
                      <Image 
                        src={data.user.avatar_url} 
                        alt={data.user.full_name || 'Usuario'} 
                        width={48} 
                        height={48} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                        {data.user.full_name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{data.user.full_name || 'Usuario'}</p>
                    <p className="text-sm text-muted-foreground">{data.user.email || 'Correo no disponible'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Información del usuario no disponible</p>
              )}
              
              <button className="w-full mt-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
                Contactar con el anunciante
              </button>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
