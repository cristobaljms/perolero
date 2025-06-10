"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueries } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { errorToast, successToast } from "@/lib/toast";
import { getVehicleSubCategories } from "@/services/client";
import { uploadListingImages } from "@/utils/upload-images";
import ImageUpload from "../ui/image-upload";
import useLocation from "../hooks/useLocation";
import { Listing } from "@/types/listing-types";
import { MAX_IMAGES } from "@/utils/constants";

const formSchema = z.object({
  category_id: z.string({
    message: "Campo requerido",
  }),
  price: z.coerce.number().positive({
    message: "El precio debe ser un número positivo.",
  }),
  vehicle_year: z.string({
    required_error: "Por favor selecciona el año del vehículo.",
  }),
  vehicle_brand: z.string({
    required_error: "Por favor selecciona la marca del vehículo.",
  }),
  vehicle_model: z.string({
    required_error: "Por favor selecciona el modelo del vehículo.",
  }),
  state_id: z.string({
    message: "Campo requerido",
  }),
  city_id: z.string({
    message: "Campo requerido",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditListingVehicleFormProps {
  listing: Listing;
}

export default function EditListingVehicleForm({
  listing,
}: EditListingVehicleFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setSelectedState, states, cities } = useLocation();

  const [categoriesQuery] = useQueries({
    queries: [
      {
        queryKey: ["categories", 1],
        queryFn: () => getVehicleSubCategories(),
        staleTime: 5 * 60 * 1000,
      },
    ],
  });

  const categories = categoriesQuery.data;

  const vehicleYear = listing.attributes?.find(
    (attr) => attr.name === "año"
  );
  const vehicleBrand = listing.attributes?.find(
    (attr) => attr.name === "marca"
  );
  const vehicleModel = listing.attributes?.find(
    (attr) => attr.name === "modelo"
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_id: listing.sub_category?.id?.toString() || "",
      state_id: listing.state_id?.id.toString() || "",
      city_id: listing.city_id?.id.toString() || "",
      price: listing.price || undefined,
      vehicle_year: vehicleYear?.value || "",
      vehicle_brand: vehicleBrand?.value || "",
      vehicle_model: vehicleModel?.value || "",
      description: listing.description || "",
    },
  });

  useEffect(() => {
    if (listing.state_id?.id) {
      setSelectedState(Number(listing.state_id.id));
    }

    const existingImageUrls =
      listing.images?.map((img) => img.image_url) || [];
    setExistingImages(existingImageUrls);
  }, [listing]);

  const handleImageChange = (newImages: File[], newImageUrls: string[]) => {
    setImages(newImages);
    setImageUrls(newImageUrls);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imageUrls[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(data: FormValues) {
    if (images.length === 0 && existingImages.length === 0) {
      errorToast("Debes tener al menos una imagen para tu anuncio.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // Actualizar el listing
      const { error: listingError } = await supabase
        .from("listings")
        .update({
          sub_category_id: data.category_id,
          price: data.price,
          city_id: data.city_id,
          state_id: data.state_id,
          description: data.description || null,
          text_search: `${data.description} ${data.vehicle_year} ${data.vehicle_brand} ${data.vehicle_model}`,
        })
        .eq("id", listing.id);

      if (listingError) throw listingError;

      const attributesToUpdate = [
        { name: "año", value: data.vehicle_year },
        { name: "marca", value: data.vehicle_brand },
        { name: "modelo", value: data.vehicle_model },
      ];

      for (const attr of attributesToUpdate) {
        const { error: attributeError } = await supabase
          .from("listing_attributes")
          .update({
            value: attr.value,
          })
          .eq("listing_id", listing.id)
          .eq("name", attr.name);

        if (attributeError) throw attributeError;
      }

      // Eliminar imágenes existentes que fueron removidas
      const { data: currentImages } = await supabase
        .from("listing_images")
        .select("*")
        .eq("listing_id", listing.id);

      if (currentImages) {
        const imagesToDelete = currentImages.filter(
          (img: any) => !existingImages.includes(img.image_url)
        );

        for (const img of imagesToDelete) {
          await supabase.from("listing_images").delete().eq("id", img.id);
          // También eliminar la imagen del storage si es necesario
          const imagePath = img.image_url.split("/").pop();
          if (imagePath) {
            await supabase.storage.from("listing-images").remove([imagePath]);
          }
        }
      }

      // Subir nuevas imágenes si las hay
      if (images.length > 0) {
        await uploadListingImages(images, listing.id.toString(), supabase);
      }

      successToast("Anuncio actualizado");
      router.push(`/a/${listing.id}`);
    } catch (error) {
      console.error("Error al actualizar el anuncio:", error);
      errorToast(
        "Hubo un problema al actualizar el anuncio. Inténtalo de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full max-w-2xl"
      >
        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de vehículo</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    $
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    className="pl-8"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vehicle_brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marca del vehículo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Toyota" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vehicle_model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo del vehículo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Corolla" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vehicle_year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Año del vehículo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: 2020" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <Select
                onValueChange={(e) => {
                  field.onChange(e);
                  setSelectedState(Number(e));
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {states?.map((state) => (
                    <SelectItem key={state.id} value={state.id.toString()}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ciudad</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una ciudad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cities?.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe tu producto, estado, características..."
                  className="resize-none min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Mostrar imágenes existentes */}
        {existingImages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Imágenes actuales</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {existingImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <ImageUpload
          images={images}
          imageUrls={imageUrls}
          onImageChange={handleImageChange}
          onRemoveImage={removeImage}
          title="Agregar nuevas imágenes"
          maxImages={MAX_IMAGES - existingImages.length}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Actualizando anuncio..." : "Actualizar anuncio"}
        </Button>
      </form>
    </Form>
  );
}
