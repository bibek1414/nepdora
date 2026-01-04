export interface ContactFormData {
  name: string;
  email: string;
  phone_number: string;
  message: string;
}

export interface ContactResponse {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  message: string;
  created_at: string;
}
