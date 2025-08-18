export interface User {
  id: number | string;
  username: string;
  email: string;
  store_name: string;
  has_usable_password?: boolean;
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

export interface SignupResponse extends User, AuthTokens {}
