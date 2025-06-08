"use client";

import { useState } from "react";
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
import { CATEGORIES } from "@/utils/constants";
import { uploadListingImages } from "@/utils/upload-images";
import ImageUpload from "../ui/image-upload";
import useLocation from "../hooks/useLocation";

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

export default function CreateListingVehicleForm() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_id: "",
      state_id: "",
      price: undefined,
      vehicle_year: "",
      vehicle_brand: "",
      vehicle_model: "",
      city_id: "",
      description: "",
    },
  });

  const handleImageChange = (newImages: File[], newImageUrls: string[]) => {
    setImages(newImages);
    setImageUrls(newImageUrls);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imageUrls[index]);

    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(data: FormValues) {
    if (images.length === 0) {
      errorToast("Debes subir al menos una imagen para tu anuncio.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: listingData, error: listingError } = await supabase
        .from("listings")
        .insert({
          category_id: CATEGORIES.VEHICLE,
          sub_category_id: data.category_id,
          price: data.price,
          city_id: data.city_id,
          state_id: data.state_id,
          description: data.description || null,
          user_id: user?.id,
          currency: "USD",
          text_search: `${data.description} ${data.vehicle_year} ${data.vehicle_brand} ${data.vehicle_model}`,
        })
        .select()
        .single();

      const { error: listingAttributesError } = await supabase
        .from("listing_attributes")
        .insert([
          {
            listing_id: listingData.id,
            value: data.vehicle_year,
            name: "vehicle_year",
          },
          {
            listing_id: listingData.id,
            value: data.vehicle_brand,
            name: "vehicle_brand",
          },
          {
            listing_id: listingData.id,
            value: data.vehicle_model,
            name: "vehicle_model",
          },
        ])
        .select();

      if (listingError || listingAttributesError)
        throw listingError || listingAttributesError;

      await uploadListingImages(images, listingData.id, supabase);

      successToast("Anuncio creado");

      router.push(`/a/${listingData.id}`);
    } catch (error) {
      console.error("Error al crear el anuncio:", error);
      errorToast("Hubo un problema al crear el anuncio. Inténtalo de nuevo.");
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
                  console.log(e);
                  setSelectedState(Number(e));
                }}
                defaultValue={field.value}
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <ImageUpload
          images={images}
          imageUrls={imageUrls}
          onImageChange={handleImageChange}
          onRemoveImage={removeImage}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creando anuncio..." : "Crear anuncio"}
        </Button>
      </form>
    </Form>
  );
}
