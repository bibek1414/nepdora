export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  message: string;
  created_at: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone_number: string;
  message: string;
}
