export interface User {
  id: number | string;
  username?: string;
  email: string;
  store_name: string;
  has_usable_password?: boolean;
  user_id?: number;
  has_profile?: boolean;
  role?: string;
  phone_number?: string;
  domain?: string;
  sub_domain?: string;
  has_profile_completed?: boolean;
  first_login?: boolean;
  is_onboarding_complete?: boolean;
  website_type?: string;
}
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse {
  status: number;
  data: {
    user: {
      display: string;
      has_usable_password: boolean;
      id: number;
      access_token: string;
      refresh_token: string;
      username: string;
    };
    methods: Array<{
      method: string;
      at: number;
      email: string;
    }>;
  };
  meta: {
    is_authenticated: boolean;
  };
}

export enum Role {
  OWNER = "owner",
  VIEWER = "viewer",
}

export interface SignupResponse {
  id: number;
  email: string;
  username: string;
  store_name: string;
  role: Role;
  website_type: "ecommerce" | "service";
}
