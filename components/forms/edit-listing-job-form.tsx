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
import { createClient } from "@/utils/supabase/client";
import { errorToast, successToast } from "@/lib/toast";
import { uploadListingImages } from "@/utils/upload-images";
import ImageUpload from "@/components/ui/image-upload";
import useLocation from "../hooks/useLocation";
import { Listing } from "@/types/listing-types";
import { MAX_IMAGES } from "@/utils/constants";

const formSchema = z.object({
  job_title: z.string({
    required_error: "Campo requerido",
  }),
  price: z.coerce.number().positive({
    message: "El precio debe ser un número positivo.",
  }),
  state_id: z.string().optional(),
  city_id: z.string().optional(),
  description: z.string().optional(),
  remote: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditListingJobFormProps {
  listing: Listing;
}

export default function EditListingJobForm({
  listing,
}: EditListingJobFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setSelectedState, states, cities } = useLocation();

  // Buscar los atributos del trabajo
  const jobTitle = listing.attributes?.find(
    (attr) => attr.name === "job_title"
  );
  const remoteAttribute = listing.attributes?.find(
    (attr) => attr.name === "remote"
  );

  const isRemote = remoteAttribute?.value === "Remoto";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job_title: jobTitle?.value || "",
      price: listing.price || undefined,
      state_id: listing.state_id?.id?.toString() || "",
      city_id: listing.city_id?.id?.toString() || "",
      description: listing.description || "",
      remote: isRemote,
    },
  });

  useEffect(() => {
    if (listing.state_id?.id && !isRemote) {
      setSelectedState(Number(listing.state_id.id));
    }

    const existingImageUrls =
      listing.images?.map((img) => img.image_url) || [];
    setExistingImages(existingImageUrls);
  }, [listing, isRemote]);

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
          price: data.price,
          city_id: data.remote ? null : data.city_id,
          state_id: data.remote ? null : data.state_id,
          description: data.description || null,
          text_search: `${data.job_title} ${data.description}`,
        })
        .eq("id", listing.id);

      if (listingError) throw listingError;

      // Actualizar los atributos del trabajo
      const attributesToUpdate = [
        { name: "job_title", value: data.job_title },
        { name: "remote", value: data.remote ? "Remoto" : "Presencial" },
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

  const handleRemoteChange = (value: boolean) => {
    form.setValue("remote", value);
    if (value) {
      form.setValue("state_id", "");
      form.setValue("city_id", "");
      form.clearErrors("state_id");
      form.clearErrors("city_id");
    }
  };

  const handleStateChange = (value: string) => {
    form.setValue("state_id", value);
    form.clearErrors("city_id");
    form.clearErrors("state_id");
    setSelectedState(Number(value));
  };

  const handleCityChange = (value: string) => {
    form.setValue("city_id", value);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full max-w-2xl"
      >
        <FormField
          control={form.control}
          name="job_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del trabajo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Desarrollador Web" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sueldo</FormLabel>
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
          name="remote"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-4">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={() => handleRemoteChange(!field.value)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Trabajo Remoto
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        {!form.watch("remote") && (
          <FormField
            control={form.control}
            name="state_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select
                  onValueChange={(e) => handleStateChange(e)}
                  value={field.value}
                  disabled={form.watch("remote")}
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
        )}

        {!form.watch("remote") && (
          <FormField
            control={form.control}
            name="city_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad</FormLabel>
                <Select
                  onValueChange={(e) => handleCityChange(e)}
                  value={field.value}
                  disabled={form.watch("remote")}
                >
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
        )}

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
