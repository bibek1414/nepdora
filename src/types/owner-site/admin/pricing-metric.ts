export interface PricingMetric {
  id: number;
  name: string;
  price_per_unit: string | number;
  unit: string;
  last_updated: string;
}

export interface PricingMetricQueryParams {
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GetPricingMetricsResponse {
  results: PricingMetric[];
  count: number;
}

export interface CreatePricingMetricRequest {
  name: string;
  price_per_unit: string | number;
  unit: string;
}

export interface UpdatePricingMetricRequest {
  name?: string;
  price_per_unit?: string | number;
  unit?: string;
}

export interface CreatePricingMetricResponse {
  data: PricingMetric;
  message: string;
}

export interface UpdatePricingMetricResponse {
  data: PricingMetric;
  message: string;
}

export interface DeletePricingMetricResponse {
  message: string;
}
