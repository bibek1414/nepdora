export type PaymentMethod = "esewa" | "khalti";

export interface PaymentRequestData {
  amount: string;
  productName: string;
  transactionId: string;
  method: PaymentMethod;
}

// Khalti Types based on official documentation
export interface KhaltiInitiateRequest {
  return_url: string;
  website_url: string;
  amount: number; // Amount in paisa
  purchase_order_id: string;
  purchase_order_name: string;
  customer_info?: {
    name: string;
    email: string;
    phone: string;
  };
  amount_breakdown?: Array<{
    label: string;
    amount: number;
  }>;
  product_details?: Array<{
    identity: string;
    name: string;
    total_price: number;
    quantity: number;
    unit_price: number;
  }>;
  merchant_username?: string;
  merchant_extra?: string;
}

export interface KhaltiInitiateResponse {
  pidx: string;
  payment_url: string;
  expires_at: string;
  expires_in: number;
}

export interface KhaltiLookupRequest {
  pidx: string;
}

export interface KhaltiLookupResponse {
  pidx: string;
  total_amount: number;
  status: KhaltiPaymentStatus;
  transaction_id: string | null;
  fee: number;
  refunded: boolean;
}

export type KhaltiPaymentStatus =
  | "Completed"
  | "Pending"
  | "Initiated"
  | "Refunded"
  | "Expired"
  | "User canceled"
  | "Partially Refunded";

export interface KhaltiCallbackParams {
  pidx: string;
  status: KhaltiPaymentStatus;
  transaction_id?: string;
  tidx?: string;
  amount: string;
  mobile?: string;
  purchase_order_id: string;
  purchase_order_name: string;
  total_amount: string;
}

// eSewa Types based on official documentation
export interface EsewaInitiateRequest {
  amount: string;
  tax_amount?: number;
  total_amount: number;
  product_service_charge?: number;
  product_delivery_charge?: number;
  success_url: string;
  failure_url: string;
}

export interface EsewaInitiateResponse {
  amount: string;
  tax_amount: number;
  total_amount: number;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: number;
  product_delivery_charge: number;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
  payment_url: string;
}

export interface EsewaVerificationRequest {
  data: string; // Base64 encoded response from eSewa
}

export interface EsewaVerificationResponse {
  transaction_code: string;
  status: EsewaPaymentStatus;
  total_amount: number;
  transaction_uuid: string;
  product_code: string;
  ref_id: string;
  is_success: boolean;
  should_provide_service: boolean;
}

export interface EsewaStatusCheckRequest {
  product_code: string;
  total_amount: number;
  transaction_uuid: string;
}

export interface EsewaStatusCheckResponse {
  product_code: string;
  transaction_uuid: string;
  total_amount: number;
  status: EsewaPaymentStatus;
  ref_id: string | null;
  is_success: boolean;
  should_provide_service: boolean;
}

export type EsewaPaymentStatus =
  | "COMPLETE"
  | "PENDING"
  | "FULL_REFUND"
  | "PARTIAL_REFUND"
  | "AMBIGUOUS"
  | "NOT_FOUND"
  | "CANCELED";

export interface EsewaCallbackParams {
  data: string; // Base64 encoded response
  // Decoded response contains:
  // transaction_code: string;
  // status: string;
  // total_amount: string;
  // transaction_uuid: string;
  // product_code: string;
  // signed_field_names: string;
  // signature: string;
}

// Legacy eSewa Types (keeping for backward compatibility)
export interface EsewaConfigData {
  amount: string;
  tax_amount: number;
  total_amount: number;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: number;
  product_delivery_charge: number;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
}

export interface EsewaResponse {
  amount: string;
  esewaConfig: EsewaConfigData;
}

// API Response Types
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  error_key?: string;
  details?: unknown;
  status_code?: number;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// Khalti API Error Types
export interface KhaltiValidationError {
  error_key: "validation_error";
  [key: string]: string[] | "validation_error";
}

export interface KhaltiAuthError {
  detail: string;
  status_code: 401;
}

export interface KhaltiNotFoundError {
  detail: string;
  error_key: "validation_error";
}

export type KhaltiErrorResponse =
  | KhaltiValidationError
  | KhaltiAuthError
  | KhaltiNotFoundError;

// eSewa Error Types
export interface EsewaServiceError {
  code: number;
  error_message: string;
}

export interface EsewaSignatureError {
  error: string;
  message: string;
}

export type EsewaErrorResponse = EsewaServiceError | EsewaSignatureError;

// Dummy Data Response
export interface DummyDataResponse {
  amount: string;
  productName: string;
  transactionId: string;
}

// Payment Status for UI
export interface PaymentState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
}

// Payment Verification for UI
export interface PaymentVerification {
  pidx?: string;
  status?: string;
  transaction_id?: string;
  total_amount?: string;
  fee?: string;
  refunded?: boolean;
  is_success?: boolean;
  should_provide_service?: boolean;
  transaction_code?: string; // For eSewa
  transaction_uuid?: string; // For eSewa
  ref_id?: string; // For eSewa
}
