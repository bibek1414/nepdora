export interface PaymentGateway {
  id: string;
  payment_type: "esewa" | "khalti";
  merchant_code?: string; // Only for eSewa
  secret_key: string;
  is_enabled: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePaymentGatewayRequest {
  payment_type: "esewa" | "khalti";
  merchant_code?: string; // Required for eSewa
  secret_key: string;
  is_enabled: boolean;
}

export interface UpdatePaymentGatewayRequest {
  payment_type?: "esewa" | "khalti";
  merchant_code?: string;
  secret_key?: string;
  is_enabled?: boolean;
}

export interface CreatePaymentGatewayResponse {
  success: boolean;
  data: PaymentGateway;
  message: string;
}

export interface UpdatePaymentGatewayResponse {
  success: boolean;
  data: PaymentGateway;
  message: string;
}

export interface GetPaymentGatewayResponse {
  success: boolean;
  data: PaymentGateway;
  message: string;
}

export interface DeletePaymentGatewayResponse {
  success: boolean;
  message: string;
}

export interface ProductPurchased {
  id: number;
  price: string;
  product: {
    id: number;
    name: string;
    slug: string;
    price: string;
    market_price: string;
    thumbnail_image: string;
    thumbnail_alt_description: string | null;
  };
  variant: any;
  quantity: number;
}

export interface PaymentHistory {
  id: number;
  payment_type: "esewa" | "khalti";
  pay_amount: string;
  transaction_id: string;
  products_purchased: ProductPurchased[];
  status: string;
  additional_info: {
    pidx?: string;
    status?: string;
    is_fallback: boolean;
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export interface TenantCentralPayment extends Omit<PaymentHistory, "id"> {
  id: number;
  tenant: string;
  additional_info: {
    pidx: string;
    status: string;
    is_fallback: boolean;
    tenant_subdomain: string;
    [key: string]: any;
  };
}

export interface PaymentHistoryListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PaymentHistory[];
}

export interface TenantCentralPaymentListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TenantCentralPayment[];
}

export interface PaymentSummary {
  total_received: number;
  total_paid: number;
  pending_balance: number;
}
