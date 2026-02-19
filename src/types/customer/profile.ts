export interface CustomerProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  image?: string | null;
  username?: string | null;
}

export interface ProfileResponse {
  message: string;
  data: CustomerProfile;
}
