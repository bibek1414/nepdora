export interface ReviewUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface ReviewProduct {
  id: number;
  name: string;
  slug: string;
  market_price: string;
  price: string;
  thumbnail_image: string;
  meta_title: string;
  meta_description: string;
  category: {
    id: number;
    image: string;
    name: string;
    slug: string;
    description: string;
  };
}

export interface Review {
  id: number;
  product: ReviewProduct;
  user: ReviewUser;
  review: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewData {
  product_id: number;
  rating: number;
  review: string;
}

export interface UpdateReviewData {
  rating?: number;
  review?: string;
}

export interface ReviewsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Review[];
}

export interface ReviewFilters {
  product_id?: number;
  rating?: number;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}
