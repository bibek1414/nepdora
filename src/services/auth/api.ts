import { LoginResponse, SignupResponse } from "@/types/auth/auth";
import { ErrorResponse, ApiErrorResponse } from "@/types/auth/error.types";
import { siteConfig } from "@/config/site";

const API_BASE_URL = siteConfig.apiBaseUrl;

interface SignupData {
  email: string;
  password: string;
  phone: string;
  store_name: string;
}
interface CreateTemplateAccountData {
  email: string;
  password: string;
  phone: string;
  store_name: string;
  template_name: string;
}

interface TemplateAccountResponse {
  id: number | string;
  slug: string;
  name: string;
  store_name: string;
  email: string;
  message: string;
  success: boolean;
}
interface LoginData {
  email: string;
  password: string;
}

interface ResendVerificationData {
  email: string;
}

interface ResendVerificationResponse {
  message: string;
  success: boolean;
}

interface PasswordResetRequestData {
  email: string;
}

interface PasswordResetRequestResponse {
  message: string;
  success: boolean;
}

class ApiError extends Error implements ErrorResponse {
  response?: {
    status: number;
    data?: ApiErrorResponse;
  };
  request?: unknown;

  constructor(message: string, status: number, data?: ApiErrorResponse) {
    super(message);
    this.name = "ApiError";
    this.response = {
      status,
      data,
    };
  }
}
interface PasswordResetKeyValidationResponse {
  status: number;
  data?: {
    user: {
      id: number;
      display: string;
      has_usable_password: boolean;
      email: string;
      username: string;
    };
  };
  errors?: Array<{
    message: string;
    code: string;
    param: string;
  }>;
}

interface PasswordResetData {
  key: string;
  password: string;
}

interface PasswordResetResponse {
  message: string;
  success: boolean;
}

// NEW: Validate the reset key first
export async function validatePasswordResetKey(
  key: string
): Promise<PasswordResetKeyValidationResponse> {
  const response = await fetch(
    `${API_BASE_URL}/_allauth/browser/v1/auth/password/reset`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "X-Password-Reset-Key": key,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    if (data.status === 400) {
      throw new ApiError(
        "The password reset token is invalid or has expired",
        response.status,
        data
      );
    }
    if (data.status === 409) {
      throw new ApiError(
        "This password reset link has already been used",
        response.status,
        data
      );
    }
    throw new ApiError("Failed to validate reset key", response.status, data);
  }

  return data;
}

export async function signupUser(data: SignupData): Promise<SignupResponse> {
  const response = await fetch(`${API_BASE_URL}/api/signup/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ApiErrorResponse;

    throw new ApiError("Signup failed", response.status, errorData);
  }

  return response.json();
}
export async function createTemplateAccount(
  data: CreateTemplateAccountData
): Promise<TemplateAccountResponse> {
  const response = await fetch(`${API_BASE_URL}/api/signup/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      is_template_account: true,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(
      "Template account creation failed",
      response.status,
      errorData
    );
  }

  return response.json();
}
export async function loginUser(data: LoginData): Promise<LoginResponse> {
  const response = await fetch(
    `${API_BASE_URL}/_allauth/browser/v1/auth/login`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = (await response.json()) as ApiErrorResponse;

    throw new ApiError("Login failed", response.status, errorData);
  }

  return response.json();
}

export async function resendVerificationEmail(
  data: ResendVerificationData
): Promise<ResendVerificationResponse> {
  const response = await fetch(`${API_BASE_URL}/api/resend-verification/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = (await response.json()) as ApiErrorResponse;

    throw new ApiError(
      "Failed to resend verification email",
      response.status,
      errorData
    );
  }

  return response.json();
}

export async function requestPasswordReset(
  data: PasswordResetRequestData
): Promise<PasswordResetRequestResponse> {
  const response = await fetch(
    `${API_BASE_URL}/_allauth/browser/v1/auth/password/request`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = (await response.json()) as ApiErrorResponse;
    throw new ApiError(
      "Failed to request password reset",
      response.status,
      errorData
    );
  }

  return response.json();
}

export async function resetPassword(
  data: PasswordResetData
): Promise<PasswordResetResponse> {
  const response = await fetch(
    `${API_BASE_URL}/_allauth/browser/v1/auth/password/reset`,
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = (await response.json()) as ApiErrorResponse;
    throw new ApiError("Failed to reset password", response.status, errorData);
  }

  return response.json();
}
