import { createClient, createClient as createClientClient } from "@/utils/supabase/client";
import { CATEGORIES } from "@/utils/constants";

export async function getPropertySubCategories() {
  const supabase = await createClientClient();
  const { data, error } = await supabase
    .from("sub_categories")
    .select("*")
    .eq("category_id", CATEGORIES.PROPERTY);
  if (error) throw error;
  return data;
}

export async function getVehicleSubCategories() {
  const supabase = await createClientClient();
  const { data, error } = await supabase
    .from("sub_categories")
    .select("*")
    .eq("category_id", CATEGORIES.VEHICLE);
  if (error) throw error;
  return data;
}

export async function getAllCategories() {
  const supabase = await createClientClient();
  const { data, error } = await supabase.from("categories").select("*");
  if (error) throw error;
  return data;
}

export const getProductCategories = async () => {
  const supabase = await createClientClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .neq("id", 1)
    .neq("id", 2)
    .neq("id", 3);
  if (error) throw error;
  return data;
};