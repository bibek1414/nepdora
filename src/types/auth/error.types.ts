export interface AuthError {
  code: string;
  message: string;
  param?: string;
  params?: Record<string, string | number | boolean>;
}

export interface ApiErrorResponse {
  status: number;
  // New error format with errors array
  errors?: AuthError[];
  // Old error format
  error?: {
    code: number;
    message: string;
    params?: Record<string, string | number | boolean>;
  };
  data?: {
    errors?: AuthError[];
    message?: string;
    error?: string;
    detail?: string;
    flows?: Array<{
      id: string;
      providers?: string[];
      is_pending?: boolean;
    }>;
  };
  meta?: {
    is_authenticated: boolean;
  };
}

export interface ErrorResponse {
  response?: {
    status: number;
    data?: ApiErrorResponse;
  };
  request?: unknown;
  message?: string;
}

export interface FormErrorState {
  message: string;
  type: "error" | "warning" | "info";
  action?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
}

export enum AuthErrorCodes {
  INVALID_CREDENTIALS = "invalid_credentials",
  EMAIL_PASSWORD_MISMATCH = "email_password_mismatch",
  USER_NOT_FOUND = "user_not_found",
  TOO_MANY_ATTEMPTS = "too_many_login_attempts",
  ACCOUNT_DISABLED = "account_disabled",
  ACCOUNT_SUSPENDED = "account_suspended",
  EMAIL_EXISTS = "email_exists",
  STORE_NAME_TAKEN = "store_name_taken",
  VALIDATION_ERROR = "validation_error",
  EMAIL_NOT_VERIFIED = "email_not_verified",
  ACCOUNT_NOT_VERIFIED = "account_not_verified",
  PHONE_INVALID = "phone_invalid",
}

export enum FlowTypes {
  LOGIN = "login",
  SIGNUP = "signup",
  VERIFY_EMAIL = "verify_email",
  PROVIDER_REDIRECT = "provider_redirect",
  PROVIDER_TOKEN = "provider_token",
}
