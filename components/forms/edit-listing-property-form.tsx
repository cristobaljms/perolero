"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";

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
import { useQueries, useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { errorToast, successToast } from "@/lib/toast";
import { Listing, PropertyListing } from "@/types/listing-types";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_IMAGES = 3;

const formSchema = z.object({
  state_id: z.string({
    message: "Campo requerido",
  }),
  category_id: z.string({
    message: "Campo requerido",
  }),
  price: z.coerce.number().positive({
    message: "El precio debe ser un número positivo.",
  }),
  property_contract_type: z.string({
    required_error: "Por favor selecciona el tipo de contrato.",
  }),
  location: z.string().optional(),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export async function getStates() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("states").select("*");
  if (error) throw error;
  return data;
}

export async function getCities(state_id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("state_id", state_id);
  if (error) throw error;
  return data;
}

export async function getCategories(parent_id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("parent_id", parent_id);
  if (error) throw error;
  return data;
}

type EditListingPropertyFormProps = {
  data: PropertyListing;
}

export default function EditListingPropertyForm({ data }: EditListingPropertyFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(data.images?.map(img => img.image_url) || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedState, setSelectedState] = useState<number | null>(data.location ? Number(data.location.state.id) : null);
  const [existingImages, setExistingImages] = useState<{id: number, url: string}[]>(
    data.images?.map(img => ({id: img.id, url: img.image_url})) || []
  );
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);

  const [categoriesQuery, statesQuery] = useQueries({
    queries: [
      {
        queryKey: ["categories", 1],
        queryFn: () => getCategories(1),
        staleTime: 5 * 60 * 1000
      },
      {
        queryKey: ["states"],
        queryFn: () => getStates(),
        staleTime: 24 * 60 * 60 * 1000
      }
    ]
  });

  const citiesQuery = useQuery({
    queryKey: ["cities", selectedState],
    queryFn: () => getCities(selectedState!),
    enabled: !!selectedState,
    staleTime: 60 * 60 * 1000,
  });

  const categories = categoriesQuery.data;
  const states = statesQuery.data;
  const cities = citiesQuery.data;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_id: undefined,
      state_id: undefined,
      price: undefined,
      property_contract_type: undefined,
      location: "",
      description: "",
    },
  });

  useEffect(() => {
    if (selectedState) {
      citiesQuery.refetch();
    }
  }, [selectedState]);

  useEffect(() => {
    // Inicializar el formulario con los datos existentes
    if (data) {
      form.reset({
        category_id: data.category.id?.toString(),
        state_id: data.location.state.id?.toString(),
        price: data.price ?? undefined,
        property_contract_type: data.property_contract_type ?? undefined,
        location: data.location.id?.toString() ?? undefined,
        description: data.description ?? undefined,
      });
    }
  }, [data, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    if (images.length + files.length > MAX_IMAGES) {
      errorToast(`Solo puedes subir un máximo de ${MAX_IMAGES} imágenes.`);
      return;
    }

    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > MAX_FILE_SIZE) {
        errorToast(`La imagen ${file.name} excede el tamaño máximo de 5MB.`);
        continue;
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        errorToast(`El formato de ${file.name} no es válido. Usa JPG, PNG o WebP.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      // Create URLs for previews
      const newImageUrls = validFiles.map((file) => URL.createObjectURL(file));

      setImages((prev) => [...prev, ...validFiles]);
      setImageUrls((prev) => [...prev, ...newImageUrls]);
    }

    // Reset the input
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imageUrls[index]);

    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (id: number, index: number) => {
    setImagesToDelete(prev => [...prev, id]);
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(formData: FormValues) {
    if (existingImages.length === 0 && images.length === 0) {
      errorToast("Debes tener al menos una imagen para tu anuncio.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      
      // 1. Actualizar los datos del anuncio
      const { error: listingError } = await supabase
        .from("listings")
        .update({
          category_id: formData.category_id,
          price: formData.price,
          property_contract_type: formData.property_contract_type,
          location: formData.location,
          description: formData.description || null,
        })
        .eq('id', data.id);

      if (listingError) throw listingError;

      // 2. Eliminar imágenes marcadas para eliminar
      if (imagesToDelete.length > 0) {
        const { error: deleteImagesError } = await supabase
          .from("listing_images")
          .delete()
          .in('id', imagesToDelete);
          
        if (deleteImagesError) throw deleteImagesError;
      }

      // 3. Subir nuevas imágenes
      if (images.length > 0) {
        const currentPosition = existingImages.length;
        
        for (let index = 0; index < images.length; index++) {
          const image = images[index];
          const fileExt = image.name.split(".").pop();
          const fileName = `${data.id}_${index + currentPosition}_${Date.now()}.${fileExt}`;
          const filePath = `listing_images/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("listings")
            .upload(filePath, image, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from("listings")
            .getPublicUrl(filePath);

          const { error: imageError } = await supabase
            .from("listing_images")
            .insert({
              listing_id: data.id,
              image_url: urlData.publicUrl,
              position: index + currentPosition,
            });

          if (imageError) throw imageError;
        }
      }

      successToast("Anuncio actualizado correctamente");
      router.push(`/a/${data.id}`);
      
    } catch (error) {
      console.error("Error al actualizar el anuncio:", error);
      errorToast("Hubo un problema al actualizar el anuncio. Inténtalo de nuevo.");
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
              <FormLabel>Tipo de propiedad</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name="property_contract_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de contrato</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo de contrato" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="VENTA">Venta</SelectItem>
                  <SelectItem value="ALQUILER">Alquiler</SelectItem>
                </SelectContent>
              </Select>
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
              <Select onValueChange={(e) => {
                field.onChange(e);
                console.log(e);
                setSelectedState(Number(e));
              }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {states?.map((state) => (
                    <SelectItem
                      key={state.id}
                      value={state.id.toString()}
                    >
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ciudad</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una ciudad" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cities?.map((city) => (
                    <SelectItem
                      key={city.id}
                      value={city.id.toString()}
                    >
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

        <div className="space-y-2">
          <div className="font-medium">Imágenes del producto</div>
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Mostrar imágenes existentes */}
            {existingImages.map((img, index) => (
              <div
                key={`existing-${index}`}
                className="relative w-24 h-24 border rounded-md overflow-hidden group"
              >
                <Image
                  src={img.url || "/placeholder.svg"}
                  alt={`Imagen ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img.id, index)}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}
            
            {/* Mostrar nuevas imágenes */}
            {imageUrls.map((url, index) => (
              <div
                key={`new-${index}`}
                className="relative w-24 h-24 border rounded-md overflow-hidden group"
              >
                <Image
                  src={url || "/placeholder.svg"}
                  alt={`Nueva imagen ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}

            {(existingImages.length + images.length) < MAX_IMAGES && (
              <label className="w-24 h-24 border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                <Upload className="w-6 h-6 mb-1 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Subir</span>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                  multiple
                />
              </label>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Sube hasta {MAX_IMAGES} imágenes (JPG, PNG, WebP). Máximo 5MB por
            imagen.
          </p>
          {existingImages.length === 0 && images.length === 0 && (
            <p className="text-sm text-destructive">
              Debes tener al menos una imagen para tu anuncio.
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Actualizando anuncio..." : "Actualizar anuncio"}
        </Button>
      </form>
    </Form>
  );
}
