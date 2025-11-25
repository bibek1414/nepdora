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
    throw new Error(errorData.message || "Signup failed");
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
    throw new Error(errorData.error || errorData.message || "Login failed");
  }
  return response.json();
}
