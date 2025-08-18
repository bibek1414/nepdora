import { LoginResponse, SignupResponse } from '@/types/auth/auth';
import { siteConfig } from '@/config/site';

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

export async function signupUser(data: SignupData): Promise<SignupResponse> {
  const response = await fetch(`${API_BASE_URL}/api/signup/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Signup failed');
  }
  return response.json();
}

export async function loginUser(data: LoginData): Promise<LoginResponse> {
  const response = await fetch(
    `${API_BASE_URL}/_allauth/browser/v1/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Login failed');
  }
  return response.json();
}
