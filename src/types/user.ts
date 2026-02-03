export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  website_type: string | null;
  email: string;
  phone_number: string;
}

export interface UpdateUserProfile {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

export interface ChangePasswordRequest {
  old_password?: string;
  new_password?: string;
}
