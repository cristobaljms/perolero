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
import { createClient } from "@/utils/supabase/client";
import { errorToast, successToast } from "@/lib/toast";
import { uploadListingImages } from "@/utils/upload-images";
import ImageUpload from "@/components/ui/image-upload";
import { CATEGORIES } from "@/utils/constants";
import useLocation from "../hooks/useLocation";

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

export default function CreateListingJobForm() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setSelectedState, states, cities } = useLocation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      job_title: "",
      price: 0,
      city_id: "",
      state_id: "",
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
          category_id: CATEGORIES.JOB,
          price: data.price,
          city_id: data.remote ? null : data.city_id,
          state_id: data.remote ? null : data.state_id,
          description: data.description || null,
          user_id: user?.id,
          currency: "USD",
          text_search: `${data.job_title} ${data.description}`,
        })
        .select()
        .single();

      const { error: listingAttributesError } = await supabase
        .from("listing_attributes")
        .insert([
          {
            listing_id: listingData.id,
            value: data.job_title,
            name: "job_title",
          },
          {
            listing_id: listingData.id,
            value: data.remote ? "Remoto" : "Presencial",
            name: "remote",
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

  const handleRemoteChange = (value: boolean) => {
    form.setValue("remote", value);
    if (value) {
      form.setValue("state_id", "");
      form.setValue("city_id", "");
      form.setError("state_id", {
        message: "El estado es requerido",
      });
      form.setError("city_id", {
        message: "La ciudad es requerida",
      });
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
                  defaultValue={field.value}
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
                  defaultValue={field.value}
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

        <ImageUpload
          images={images}
          imageUrls={imageUrls}
          onImageChange={handleImageChange}
          onRemoveImage={removeImage}
          title="Imágenes del trabajo"
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creando anuncio..." : "Crear anuncio"}
        </Button>
      </form>
    </Form>
  );
}
