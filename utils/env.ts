// Gestión centralizada y tipada de variables de entorno
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("URL de Supabase inválida"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "Clave de Supabase requerida"),
  NEXT_PUBLIC_ADSENSE_ID: z.string().optional(),
  VERCEL_URL: z.string().optional(),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
});

// Validar variables de entorno al inicializar
function validateEnv() {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_ADSENSE_ID: process.env.NEXT_PUBLIC_ADSENSE_ID,
      VERCEL_URL: process.env.VERCEL_URL,
      VERCEL_ENV: process.env.VERCEL_ENV,
    });
  } catch (error) {
    console.error("❌ Variables de entorno inválidas:", error);
    throw new Error("Configuración de entorno inválida");
  }
}

export const env = validateEnv();

// Helpers para URLs seguras
export function getBaseUrl(): string {
  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export function isProduction(): boolean {
  return env.VERCEL_ENV === "production";
}

export function isDevelopment(): boolean {
  return env.VERCEL_ENV === "development" || !env.VERCEL_ENV;
} 