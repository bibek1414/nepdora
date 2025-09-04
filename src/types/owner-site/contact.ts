export interface Contact {
  id: number;
  name: string;
  email: string | null;
  phone_number: string | null;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface ContactFormData {
  name: string;
  email?: string;
  phone_number?: string;
  message: string;
}

export interface PaginatedContacts {
  count: number;
  next: string | null;
  previous: string | null;
  results: Contact[];
}

export interface ContactFilters {
  page?: number;
  page_size?: number;
  search?: string;
}
