"use client";

import type React from "react";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { errorToast } from "@/lib/toast";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  MAX_IMAGES,
} from "@/utils/constants";

interface ImageUploadProps {
  images: File[];
  imageUrls: string[];
  onImageChange: (newImages: File[], newImageUrls: string[]) => void;
  onRemoveImage: (index: number) => void;
  maxImages?: number;
  title?: string;
  description?: string;
}

export default function ImageUpload({
  images,
  imageUrls,
  onImageChange,
  onRemoveImage,
  maxImages = MAX_IMAGES,
  title = "Imágenes del producto",
  description = `Sube hasta ${MAX_IMAGES} imágenes (JPG, PNG, WebP). Máximo 5MB por imagen.`,
}: ImageUploadProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    if (images.length + files.length > maxImages) {
      errorToast(`Solo puedes subir un máximo de ${maxImages} imágenes.`);
      return;
    }

    // Validate each file
    const validFiles: File[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > MAX_FILE_SIZE) {
        errorToast(`La imagen ${file.name} excede el tamaño máximo de 5MB.`);
        continue;
      }

      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        errorToast(
          `El formato de ${file.name} no es válido. Usa JPG, PNG o WebP.`
        );
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      const newImageUrls = validFiles.map((file) => URL.createObjectURL(file));
      const updatedImages = [...images, ...validFiles];
      const updatedImageUrls = [...imageUrls, ...newImageUrls];

      onImageChange(updatedImages, updatedImageUrls);
    }

    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    onRemoveImage(index);
  };

  return (
    <div className="space-y-2">
      <div className="font-medium">{title}</div>
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
              onClick={() => handleRemoveImage(index)}
              className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-5 h-5 text-white" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
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
      <p className="text-sm text-muted-foreground">{description}</p>
      {images.length === 0 && (
        <p className="text-sm text-destructive">
          Debes subir al menos una imagen para tu anuncio.
        </p>
      )}
    </div>
  );
}
