import ListingDetails from "@/components/listings/listing-details";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ListingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return <ListingDetails user_id={user.id} />;
}
