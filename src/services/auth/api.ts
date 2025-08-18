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

interface LoginData {
  email: string;
  password: string;
}

// Create a custom error class that extends Error with proper typing
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
