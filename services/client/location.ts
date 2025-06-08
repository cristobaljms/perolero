import { createClient as createClientClient } from "@/utils/supabase/client";

export async function getStates() {
  const supabase = await createClientClient();
  const { data, error } = await supabase.from("states").select("*");
  if (error) throw error;
  return data;
}

export async function getCities(state_id: number) {
  const supabase = await createClientClient();
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("state_id", state_id);
  if (error) throw error;
  return data;
}