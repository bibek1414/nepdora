export interface ContactFormData {
  name: string;
  email: string;
  phone_number: string;
  message: string;
  website_url?: string;
}

export interface ContactResponse {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  message: string;
  created_at: string;
}
