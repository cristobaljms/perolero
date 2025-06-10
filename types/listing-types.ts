import { Tables } from "@/types/database";

export type Listing = {
  id: Tables<"listings">["id"];
  price: Tables<"listings">["price"];
  currency: Tables<"listings">["currency"];
  city_id: {
    id: Tables<"cities">["id"];
    name: Tables<"cities">["name"];
  };
  state_id: {
    id: Tables<"states">["id"];
    name: Tables<"states">["name"];
  };
  description: Tables<"listings">["description"];
  created_at: Tables<"listings">["created_at"];
  expire_at: Tables<"listings">["expire_at"];
  featured: Tables<"listings">["featured"];
  views: Tables<"listings">["views"];
  state: Tables<"listings">["state"];
  slug: Tables<"listings">["slug"];
  category_id: Tables<"listings">["category_id"];
  category: {
    id: Tables<"categories">["id"];
    name: Tables<"categories">["name"];
    tag: Tables<"categories">["tag"];
  };
  sub_category?: {
    id: Tables<"sub_categories">["id"];
    name: Tables<"sub_categories">["name"];
    tag: Tables<"sub_categories">["tag"];
    category_id: Tables<"sub_categories">["category_id"];
  };
  user: {
    id: Tables<"users">["id"];
    full_name: Tables<"users">["full_name"];
    avatar_url: Tables<"users">["avatar_url"];
    email: Tables<"users">["email"];
    phone: Tables<"users">["phone"];
    phone_verified: Tables<"users">["phone_verified"];
  };
  images: Array<{
    id: Tables<"listing_images">["id"];
    image_url: Tables<"listing_images">["image_url"];
    position: Tables<"listing_images">["position"];
  }>;
  attributes?: Array<{
    id: Tables<"listing_attributes">["id"];
    name: Tables<"listing_attributes">["name"];
    value: Tables<"listing_attributes">["value"];
  }>;
};
