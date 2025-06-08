import { createClient } from "@/utils/supabase/client";

export async function uploadListingImages(
  images: File[],
  listingId: string,
  supabase = createClient()
): Promise<string[]> {
  const imageUrls: string[] = [];

  for (let index = 0; index < images.length; index++) {
    const image = images[index];
    // Crear un nombre único para la imagen
    const fileExt = image.name.split(".").pop();
    const fileName = `${listingId}_${index}_${Date.now()}.${fileExt}`;
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
        listing_id: listingId,
        image_url: urlData.publicUrl,
        position: index,
      });

    if (imageError) throw imageError;
  }

  return imageUrls;
} 