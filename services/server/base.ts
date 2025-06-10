import { createClient } from "@/utils/supabase/server";

export async function baseServerQuery(queryBuilder: (supabase: any) => any) {
  const supabase = await createClient();

  try {
    const result = await queryBuilder(supabase);
    return result.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
