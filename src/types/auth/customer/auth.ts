export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  username?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface DecodedAccessToken {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
}

// API Response Types
export interface SignupResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
}

export interface LoginResponse {
  message: string;
  tokens: {
    refresh: string;
    access: string;
  };
}
