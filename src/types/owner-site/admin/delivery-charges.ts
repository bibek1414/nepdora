export interface DeliveryCharge {
  id: number;
  location_name: string | null;
  is_default?: boolean;
  default_cost: string | null;
  cost_0_1kg: string | null;
  cost_1_2kg: string | null;
  cost_2_3kg: string | null;
  cost_3_5kg: string | null;
  cost_5_10kg: string | null;
  cost_above_10kg: string | null;
}

export interface DefaultDeliveryCharge {
  id: number;
  location_name: null;
  is_default: true;
  default_cost: string;
  cost_0_1kg: string;
  cost_1_2kg: string;
  cost_2_3kg: string;
  cost_3_5kg: string;
  cost_5_10kg: string;
  cost_above_10kg: string;
}

export interface DeliveryChargesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: DeliveryCharge[];
}
export interface CreateDeliveryChargeRequest {
  location_name: string;
  default_cost?: string | null;
  cost_0_1kg?: string | null;
  cost_1_2kg?: string | null;
  cost_2_3kg?: string | null;
  cost_3_5kg?: string | null;
  cost_5_10kg?: string | null;
  cost_above_10kg?: string | null;
}
export interface UpdateDeliveryChargeRequest {
  id: number;
  default_cost?: string | null;
  cost_0_1kg?: string | null;
  cost_1_2kg?: string | null;
  cost_2_3kg?: string | null;
  cost_3_5kg?: string | null;
  cost_5_10kg?: string | null;
  cost_above_10kg?: string | null;
}

export interface DeliveryChargeError {
  detail?: string;
  default_cost?: string[];
  cost_0_1kg?: string[];
  cost_1_2kg?: string[];
  cost_2_3kg?: string[];
  cost_3_5kg?: string[];
  cost_5_10kg?: string[];
  cost_above_10kg?: string[];
}
