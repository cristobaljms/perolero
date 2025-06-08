"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
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
import { ContactInfoDialog } from "../dialogs/contact-info-dialog";
import { Button } from "../ui/button";
import { SimpleConfirmDialog } from "../dialogs/simple-confirm-dialog";
import { useRouter } from "next/navigation";
import { createClient as createClientClient } from "@/utils/supabase/client";
import { successToast, errorToast } from "@/lib/toast";
import { getListing } from "@/services/client";

export default function ListingDetails({ user_id }: { user_id: string }) {
  const [contactInfoDialogOpen, setContactInfoDialogOpen] =
    React.useState(false);
  const [deleteListingDialogOpen, setDeleteListingDialogOpen] =
    React.useState(false);
  const [disableListingDialogOpen, setDisableListingDialogOpen] =
    React.useState(false);

  const router = useRouter();
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
  const goToImage = React.useCallback(
    (index: number) => {
      if (api) {
        api.scrollTo(index);
        setCurrentIndex(index);
      }
    },
    [api]
  );

  const handleDeleteListing = async () => {
    const supabase = createClientClient();

    try {
      setDeleteListingDialogOpen(false);

      // Obtener las imágenes del anuncio
      const { data: imageData, error: imageError } = await supabase
        .from("listing_images")
        .select("image_url")
        .eq("listing_id", listing_id);

      if (imageError) throw imageError;

      // Eliminar las imágenes del storage
      for (const image of imageData || []) {
        // Extraer la ruta del archivo de la URL pública
        const filePath = image.image_url.split("/").pop();
        if (filePath) {
          const { error: deleteStorageError } = await supabase.storage
            .from("listings")
            .remove([`listing_images/${filePath}`]);

          if (deleteStorageError)
            console.error("Error al eliminar imagen:", deleteStorageError);
        }
      }

      // Eliminar las referencias de imágenes en la base de datos
      const { error: deleteImagesError } = await supabase
        .from("listing_images")
        .delete()
        .eq("listing_id", listing_id);

      if (deleteImagesError) throw deleteImagesError;

      // Eliminar el anuncio
      const { error: deleteListingError } = await supabase
        .from("listings")
        .delete()
        .eq("id", listing_id);

      if (deleteListingError) throw deleteListingError;

      successToast("Anuncio eliminado");

      // Redirigir a la página principal
      router.push("/perfil");
    } catch (error) {
      console.error("Error al eliminar el anuncio:", error);
      errorToast(
        "Hubo un problema al eliminar el anuncio. Inténtalo de nuevo."
      );
    }
  };

  const handleDisableListing = async () => {
    try {
      setDisableListingDialogOpen(false);
      // Aquí implementarías la lógica para deshabilitar el anuncio

      successToast("Anuncio deshabilitado");
    } catch (error) {
      console.error("Error al deshabilitar el anuncio:", error);
      errorToast(
        "Hubo un problema al deshabilitar el anuncio. Inténtalo de nuevo."
      );
    }
  };

  const handleEditListing = async () => {
    router.push(`/a/${listing_id}/editar`);
  };

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
                  index === currentIndex
                    ? "border-primary"
                    : "border-transparent"
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
              {data?.user?.id === user_id && (
                <div className="flex space-x-2 mb-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteListingDialogOpen(true)}
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleEditListing}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDisableListingDialogOpen(true)}
                  >
                    Deshabilitar
                  </Button>
                </div>
              )}
            </div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-primary">
                {data?.price
                  ? `${data.price.toLocaleString("es-ES")} €`
                  : "Precio no disponible"}
              </h2>
              {<p className="text-sm text-muted-foreground">En venta</p>}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Descripción</h3>
              <p className="text-gray-700">
                {data?.description || "Sin descripción disponible"}
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">
                Información del anunciante
              </h3>
              {data?.user ? (
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-3">
                    {data.user.avatar_url ? (
                      <Image
                        src={data.user.avatar_url}
                        alt={data.user.full_name || "Usuario"}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                        {data.user.full_name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {data.user.full_name || "Usuario"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">
                  Información del usuario no disponible
                </p>
              )}

              <button
                className="w-full mt-4 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                onClick={() => setContactInfoDialogOpen(true)}
              >
                Contactar con el anunciante
              </button>
            </div>
          </div>
        </div>
      </div>
      <ContactInfoDialog
        open={contactInfoDialogOpen}
        onOpenChange={setContactInfoDialogOpen}
        listing={data as Listing}
      />
      <SimpleConfirmDialog
        open={deleteListingDialogOpen}
        onOpenChange={setDeleteListingDialogOpen}
        onConfirm={handleDeleteListing}
        title="Eliminar anuncio"
        description="¿Estás seguro de querer eliminar este anuncio?"
        confirmButtonText="Eliminar"
      />
      <SimpleConfirmDialog
        open={disableListingDialogOpen}
        onOpenChange={setDisableListingDialogOpen}
        onConfirm={handleDisableListing}
        title="Deshabilitar anuncio"
        description="¿Estás seguro de querer deshabilitar este anuncio?"
        confirmButtonText="Deshabilitar"
      />
    </div>
  );
}
