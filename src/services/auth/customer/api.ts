import { LoginResponse, SignupResponse } from "@/types/auth/customer/auth";
import { getApiBaseUrl } from "@/config/site";

interface SignupData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  website_type: "ecommerce" | "service";
}

interface LoginData {
  email: string;
  password: string;
}

export async function signupUser(data: SignupData): Promise<SignupResponse> {
  const API_BASE_URL = getApiBaseUrl();

  const response = await fetch(`${API_BASE_URL}/api/customer/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(
      errorData.error?.message || errorData.message || "Signup failed"
    ) as any;
    error.response = {
      data: errorData,
      status: response.status,
    };
    throw error;
  }
  return response.json();
}

export async function loginUser(data: LoginData): Promise<LoginResponse> {
  const API_BASE_URL = getApiBaseUrl();

  const response = await fetch(`${API_BASE_URL}/api/customer/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(
      errorData.error?.message || errorData.message || "Login failed"
    ) as any;
    error.response = {
      data: errorData,
      status: response.status,
    };
    throw error;
  }
  return response.json();
}
