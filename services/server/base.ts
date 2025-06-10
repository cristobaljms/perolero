import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";

export async function baseServerQuery<T>(
  queryBuilder: (supabase: SupabaseClient<Database>) => Promise<{ data: T | null; error: any }>
): Promise<T> {
  const supabase = await createClient();

  try {
    const result = await queryBuilder(supabase);
    
    if (result.error) {
      console.error("Database query error:", result.error);
      throw new Error(`Database error: ${result.error.message || "Unknown error"}`);
    }
    
    if (result.data === null) {
      throw new Error("No data returned from query");
    }
    
    return result.data;
  } catch (error) {
    console.error("Base query error:", error);
    throw error instanceof Error ? error : new Error("Unknown error occurred");
  }
}
