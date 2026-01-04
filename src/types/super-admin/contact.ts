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

export interface PaginatedContactResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ContactMessage[];
}
