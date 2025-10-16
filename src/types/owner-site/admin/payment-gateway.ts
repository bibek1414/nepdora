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
