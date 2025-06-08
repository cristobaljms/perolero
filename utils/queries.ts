export const LISTING_QUERY = `
  *,
  location:cities (
    id,
    name,
    state:states (
      id,
      name
    )
  ),
  category:categories (
    id,
    name,
    tag,
    parent_id
  ),
  sub_category:sub_categories (
    id,
    name,
    tag,
    category_id
  ),
  user:users (
    id,
    full_name,
    avatar_url,
    email,
    phone,
    phone_verified
  ),
  images:listing_images (
    id,
    image_url,
    position
  ),
  attributes:listing_attributes (
    id,
    name,
    value
  )
`;

// Query más específico para optimizar performance cuando no necesites todos los campos
export const LISTING_SUMMARY_QUERY = `
  id,
  price,
  currency,
  description,
  created_at,
  expire_at,
  featured,
  views,
  state,
  slug,
  location:cities (
    id,
    name,
    state:states (
      id,
      name
    )
  ),
  category:categories (
    id,
    name,
    tag
  ),
  user:users (
    id,
    full_name,
    avatar_url
  ),
  images:listing_images (
    id,
    image_url,
    position
  )
`; 