export interface PromoCode {
  id: number;
  code: string;
  discount_percentage: string;
  valid_from: string;
  valid_to: string;
  max_uses: number | null;
  used_count: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePromoCodeRequest {
  code: string;
  discount_percentage: number;
  valid_from: string;
  valid_to: string;
  max_uses?: number | null;
  is_active?: boolean;
}

export interface UpdatePromoCodeRequest {
  code?: string;
  discount_percentage?: number;
  valid_from?: string;
  valid_to?: string;
  max_uses?: number | null;
  is_active?: boolean;
}

export interface GetPromoCodesResponse {
  results: PromoCode[];
  count: number;
  next: string | null;
  previous: string | null;
  pagination: {
    page: number;
    page_size: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface CreatePromoCodeResponse {
  data: PromoCode;
  message: string;
}

export interface UpdatePromoCodeResponse {
  data: PromoCode;
  message: string;
}

export interface DeletePromoCodeResponse {
  message: string;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
