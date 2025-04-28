"use client";

import type React from "react";

import { useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_IMAGES = 3;

const formSchema = z.object({
  sub_category_id: z.string({
    required_error: "Campo requerido",
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
  location: z.string().min(3, {
    message: "La ubicación debe tener al menos 3 caracteres.",
  }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const getSubCategories = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sub_categories")
    .select("*")
    .eq("category_id", 2);
  if (error) throw error;
  return data;
};

export default function CreateListingVehicleForm() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const { data: subCategories } = useQuery({
    queryKey: ["subCategories"],
    queryFn: () => getSubCategories(),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sub_category_id: "",
      price: undefined,
      vehicle_year: "",
      vehicle_brand: "",
      vehicle_model: "",
      location: "",
      description: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    if (images.length + files.length > MAX_IMAGES) {
      toast({
        title: "Error",
        description: `Solo puedes subir un máximo de ${MAX_IMAGES} imágenes.`,
        variant: "destructive",
      });
      return;
    }

    // Validate each file
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "Error",
          description: `La imagen ${file.name} excede el tamaño máximo de 5MB.`,
          variant: "destructive",
        });
        continue;
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
          title: "Error",
          description: `El formato de ${file.name} no es válido. Usa JPG, PNG o WebP.`,
          variant: "destructive",
        });
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      const newImageUrls = validFiles.map((file) => URL.createObjectURL(file));

      setImages((prev) => [...prev, ...validFiles]);
      setImageUrls((prev) => [...prev, ...newImageUrls]);
    }

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imageUrls[index]);

    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(data: FormValues) {
    if (images.length === 0) {
      toast({
        title: "Error",
        description: "Debes subir al menos una imagen para tu anuncio.",
        variant: "destructive",
      });
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
          sub_category_id: data.sub_category_id,
          price: data.price,
          vehicle_year: data.vehicle_year,
          vehicle_brand: data.vehicle_brand,
          vehicle_model: data.vehicle_model,
          location: data.location,
          description: data.description || null,
          user_id: user?.id,
        })
        .select()
        .single();

      if (listingError) throw listingError;

      // 2. Subimos las imágenes a Supabase Storage
      const imageUrls: string[] = [];

      for (let index = 0; index < images.length; index++) {
        const image = images[index];
        // Crear un nombre único para la imagen
        const fileExt = image.name.split(".").pop();
        const fileName = `${listingData.id}_${index}_${Date.now()}.${fileExt}`;
        const filePath = `listing_images/${fileName}`;

        // Subir la imagen a Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("listings") // Nombre del bucket en Supabase Storage
          .upload(filePath, image, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Obtener la URL pública de la imagen
        const { data: urlData } = supabase.storage
          .from("listings")
          .getPublicUrl(filePath);

        imageUrls.push(urlData.publicUrl);

        // Guardar referencia a la imagen en la tabla de imágenes
        const { error: imageError } = await supabase
          .from("listing_images")
          .insert({
            listing_id: listingData.id,
            image_url: urlData.publicUrl,
            position: index,
          });

        if (imageError) throw imageError;
      }

      toast({
        title: "Anuncio creado",
        description: "Tu anuncio ha sido creado exitosamente.",
      });

      // Redirigir a la página del anuncio o a una página de éxito
      router.push(`/a/${listingData.id}`);
    } catch (error) {
      console.error("Error al crear el anuncio:", error);
      toast({
        title: "Error",
        description:
          "Hubo un problema al crear el anuncio. Inténtalo de nuevo.",
        variant: "destructive",
      });
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
          name="sub_category_id"
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
                  {subCategories?.map((subCategory) => (
                    <SelectItem
                      key={subCategory.id}
                      value={subCategory.id.toString()}
                    >
                      {subCategory.name}
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Puerto Ordaz, Caracas" {...field} />
              </FormControl>
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
            {imageUrls.map((url, index) => (
              <div
                key={index}
                className="relative w-24 h-24 border rounded-md overflow-hidden group"
              >
                <Image
                  src={url || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
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

            {images.length < MAX_IMAGES && (
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
          {images.length === 0 && (
            <p className="text-sm text-destructive">
              Debes subir al menos una imagen para tu anuncio.
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creando anuncio..." : "Crear anuncio"}
        </Button>
      </form>
    </Form>
  );
}
