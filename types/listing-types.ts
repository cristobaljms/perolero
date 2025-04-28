import { Tables } from "@/types/database";

export type PropertyListing = {
  id: Tables<'listings'>['id'];
  property_contract_type: Tables<'listings'>['property_contract_type'];
  price: Tables<'listings'>['price'];
  location: Tables<'listings'>['location'];
  description: Tables<'listings'>['description'];
  created_at: Tables<'listings'>['created_at'];
  category: {
    id: Tables<'categories'>['id'];
    name: Tables<'categories'>['name'];
    tag: Tables<'categories'>['tag'];
    parent_id: Tables<'categories'>['parent_id'];
  };
  user: {
    id: Tables<'users'>['id'];
    full_name: Tables<'users'>['full_name'];
    avatar_url: Tables<'users'>['avatar_url'];
    email: Tables<'users'>['email'];
  };
  images: Array<{
    id: Tables<'listing_images'>['id'];
    image_url: Tables<'listing_images'>['image_url'];
    position: Tables<'listing_images'>['position'];
  }>;
};

export type ProductListing = {
  id: Tables<'listings'>['id'];
  product_title: Tables<'listings'>['product_title'];
  price: Tables<'listings'>['price'];
  location: Tables<'listings'>['location'];
  product_state: Tables<'listings'>['product_state'];
  description: Tables<'listings'>['description'];
  category: {
    id: Tables<'categories'>['id'];
    name: Tables<'categories'>['name'];
    tag: Tables<'categories'>['tag'];
    parent_id: Tables<'categories'>['parent_id'];
  };
  user: {
    id: Tables<'users'>['id'];
    full_name: Tables<'users'>['full_name'];
    avatar_url: Tables<'users'>['avatar_url'];
    email: Tables<'users'>['email'];
  };
  images: Array<{
    id: Tables<'listing_images'>['id'];
    image_url: Tables<'listing_images'>['image_url'];
    position: Tables<'listing_images'>['position'];
  }>;
};

export type VehicleListing = {
  id: Tables<'listings'>['id'];
  price: Tables<'listings'>['price'];
  location: Tables<'listings'>['location'];
  description: Tables<'listings'>['description'];
  created_at: Tables<'listings'>['created_at'];
  vehicle_brand: Tables<'listings'>['vehicle_brand'];
  vehicle_model: Tables<'listings'>['vehicle_model'];
  vehicle_year: Tables<'listings'>['vehicle_year'];  
  category: {
    id: Tables<'categories'>['id'];
    name: Tables<'categories'>['name'];
    tag: Tables<'categories'>['tag'];
    parent_id: Tables<'categories'>['parent_id'];
  };
  user: {
    id: Tables<'users'>['id'];
    full_name: Tables<'users'>['full_name'];
    avatar_url: Tables<'users'>['avatar_url'];
    email: Tables<'users'>['email'];
  };
  images: Array<{
    id: Tables<'listing_images'>['id'];
    image_url: Tables<'listing_images'>['image_url'];
    position: Tables<'listing_images'>['position'];
  }>;
};

export type JobListing = {
  id: Tables<'listings'>['id'];
  price: Tables<'listings'>['price'];
  location: Tables<'listings'>['location'];
  description: Tables<'listings'>['description'];
  created_at: Tables<'listings'>['created_at'];
  category: {
    id: Tables<'categories'>['id'];
    name: Tables<'categories'>['name'];
    tag: Tables<'categories'>['tag'];
    parent_id: Tables<'categories'>['parent_id'];
  };
  user: {
    id: Tables<'users'>['id'];
    full_name: Tables<'users'>['full_name'];
    avatar_url: Tables<'users'>['avatar_url'];
    email: Tables<'users'>['email'];
  };
  images: Array<{
    id: Tables<'listing_images'>['id'];
    image_url: Tables<'listing_images'>['image_url'];
    position: Tables<'listing_images'>['position'];
  }>;
};


export type Listing = PropertyListing | ProductListing | VehicleListing;