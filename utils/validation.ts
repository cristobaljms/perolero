import { z } from "zod";

// Esquemas de validación para mejorar seguridad
export const emailSchema = z.string().email("Email inválido").min(1, "Email requerido");

export const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[A-Z]/, "La contraseña debe contener al menos una mayúscula")
  .regex(/[a-z]/, "La contraseña debe contener al menos una minúscula")
  .regex(/[0-9]/, "La contraseña debe contener al menos un número");

export const searchQuerySchema = z
  .string()
  .max(100, "La búsqueda no puede exceder 100 caracteres")
  .regex(/^[a-zA-Z0-9\s\-\_\.]*$/, "Caracteres no válidos en la búsqueda");

export const numericIdSchema = z
  .string()
  .regex(/^[0-9]+$/, "ID debe ser numérico")
  .transform(Number)
  .refine(val => val > 0, "ID debe ser positivo");

// Sanitización de entrada de texto
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Validar URLs de imagen
export function isValidImageUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // Solo permitir HTTPS
    if (urlObj.protocol !== "https:") return false;
    
    // Lista blanca de dominios permitidos
    const allowedDomains = [
      "supabase.co",
      "images.unsplash.com",
      // Agregar otros dominios según necesidad
    ];
    
    return allowedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

// Validación de tipos de archivo
export function validateFileType(file: File): boolean {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  return allowedTypes.includes(file.type);
}

export function validateFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
} 