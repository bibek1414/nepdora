export interface SubscriptionStatus {
  active: boolean;
  status: "active" | "inactive" | "expired" | "cancelled";
  plan: string;
  expires_on: string;
}

export interface Feature {
  id: number;
  feature: string;
  description: string | null;
  is_available: boolean;
  order: number;
}

export interface Plan {
  id: number;
  plan_type: "free" | "premium" | "pro" | string;
  name: string;
  tagline: string;
  description: string;
  price: string;
  unit: "month" | "year";
  is_popular: boolean;
  features: Feature[];
}

export type PlansResponse = Plan[];

export interface UpgradeRequest {
  plan_id: number;
  payment_method?: string;
}

export interface UpgradeResponse {
  success: boolean;
  message: string;
  subscription?: SubscriptionStatus;
  payment_url?: string;
}
