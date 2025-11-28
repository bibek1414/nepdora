export interface PricingFeature {
  id?: number;
  feature: string;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Pricing {
  id: number;
  name: string;
  slug: string;
  price: string | number;
  description: string;
  is_popular: boolean;
  features: PricingFeature[];
  created_at: string;
  updated_at: string;
}

export interface PricingQueryParams {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetPricingsResponse {
  results: Pricing[];
  count: number;
}

export interface CreatePricingRequest {
  name: string;
  price: string | number;
  description: string;
  is_popular?: boolean;
  features?: PricingFeature[];
}

export interface UpdatePricingRequest {
  name?: string;
  price?: string | number;
  description?: string;
  is_popular?: boolean;
  features?: PricingFeature[];
}

export interface CreatePricingResponse {
  data: Pricing;
  message: string;
}

export interface UpdatePricingResponse {
  data: Pricing;
  message: string;
}

export interface DeletePricingResponse {
  message: string;
}
