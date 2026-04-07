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
  plan_id: number | string;
  transaction_id?: string;
  payment_type?: string;
}

export interface UpgradeResponse {
  success: boolean;
  message: string;
  subscription?: SubscriptionStatus;
  payment_url?: string;
}
export interface SubscriptionUser {
  id: number;
  first_name: string;
  last_name: string;
  website_type: string;
  email: string;
  role: string;
  phone_number: string;
}

export interface SubscriptionTenant {
  id: number;
  owner: SubscriptionUser;
  pricing_plan: {
    id: number;
    name: string;
    price: string;
    unit: string;
  };
  schema_name: string;
  name: string;
  created_on: string;
  paid_until: string;
  template_image: string | null;
  is_template_account: boolean;
  repo_url: string | null;
  description: string | null;
  preview_url: string | null;
  template_category: any;
  template_subcategory: any;
}

export interface UserSubscription {
  id: number;
  tenant: SubscriptionTenant;
  user: SubscriptionUser | null;
  plan: {
    id: number;
    name: string;
    price: string;
    unit: string;
  };
  transaction_id: string | null;
  payment_type: string;
  amount: string;
  started_on: string;
  expires_on: string;
  created_at: string;
}

export interface UserSubscriptionResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserSubscription[];
}
