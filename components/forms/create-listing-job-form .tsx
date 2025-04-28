"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Trash2, Upload } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { toast } from "@/components/ui/use-toast"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const MAX_IMAGES = 3

const formSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  price: z.coerce.number().positive({
    message: "El precio debe ser un número positivo.",
  }),
  category: z.string({
    required_error: "Por favor selecciona una categoría.",
  }),
  location: z.string().min(3, {
    message: "La ubicación debe tener al menos 3 caracteres.",
  }),
  description: z.string().optional(),
  // We'll handle images separately since they're not part of the form state
})

type FormValues = z.infer<typeof formSchema>

export default function CreateListingJobForm() {
  const router = useRouter()
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: undefined,
      category: "",
      location: "",
      description: "",
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (!files) return

    // Check if adding new files would exceed the limit
    // if (images.length + files.length > MAX_IMAGES) {
    //   toast({
    //     title: "Error",
    //     description: `Solo puedes subir un máximo de ${MAX_IMAGES} imágenes.`,
    //     variant: "destructive",
    //   })
    //   return
    // }

    // Validate each file
    const validFiles: File[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

    //   if (file.size > MAX_FILE_SIZE) {
    //     toast({
    //       title: "Error",
    //       description: `La imagen ${file.name} excede el tamaño máximo de 5MB.`,
    //       variant: "destructive",
    //     })
    //     continue
    //   }

    //   if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    //     toast({
    //       title: "Error",
    //       description: `El formato de ${file.name} no es válido. Usa JPG, PNG o WebP.`,
    //       variant: "destructive",
    //     })
    //     continue
    //   }

      validFiles.push(file)
    }

    if (validFiles.length > 0) {
      // Create URLs for previews
      const newImageUrls = validFiles.map((file) => URL.createObjectURL(file))

      setImages((prev) => [...prev, ...validFiles])
      setImageUrls((prev) => [...prev, ...newImageUrls])
    }

    // Reset the input
    e.target.value = ""
  }

  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imageUrls[index])

    setImages((prev) => prev.filter((_, i) => i !== index))
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  async function onSubmit(data: FormValues) {
    // if (images.length === 0) {
    //   toast({
    //     title: "Error",
    //     description: "Debes subir al menos una imagen para tu anuncio.",
    //     variant: "destructive",
    //   })
    //   return
    // }

    setIsSubmitting(true)

    try {
      // Here you would typically upload the images and submit the form data
      // For example, using FormData to send to your API
      const formData = new FormData()

      // Add form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, String(value))
        }
      })

      // Add images
      images.forEach((image, index) => {
        formData.append(`image-${index}`, image)
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

    //   toast({
    //     title: "Anuncio creado",
    //     description: "Tu anuncio ha sido creado exitosamente.",
    //   })

      // Redirect to a success page or listing page
      // router.push("/ads");
    } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "Hubo un problema al crear el anuncio. Inténtalo de nuevo.",
    //     variant: "destructive",
    //   })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del producto</FormLabel>
              <FormControl>
                <Input placeholder="Ej: iPhone 13 Pro Max" {...field} />
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
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">€</span>
                  <Input type="number" step="0.01" min="0" className="pl-8" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="electronics">Electrónica</SelectItem>
                  <SelectItem value="furniture">Muebles</SelectItem>
                  <SelectItem value="clothing">Ropa</SelectItem>
                  <SelectItem value="vehicles">Vehículos</SelectItem>
                  <SelectItem value="real-estate">Inmobiliaria</SelectItem>
                  <SelectItem value="other">Otros</SelectItem>
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
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Madrid, Barcelona" {...field} />
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

        {/* Image upload section - not tied to form control */}
        <div className="space-y-2">
          <div className="font-medium">Imágenes del producto</div>
          <div className="flex flex-wrap gap-4 mb-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden group">
                <Image src={url || "/placeholder.svg"} alt={`Preview ${index + 1}`} fill className="object-cover" />
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
            Sube hasta {MAX_IMAGES} imágenes (JPG, PNG, WebP). Máximo 5MB por imagen.
          </p>
          {images.length === 0 && (
            <p className="text-sm text-destructive">Debes subir al menos una imagen para tu anuncio.</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creando anuncio..." : "Crear anuncio"}
        </Button>
      </form>
    </Form>
  )
}

