export interface OurClient {
  id: number;
  name: string;
  logo: string;
  url: string | null;
  created_at: string;
  updated_at: string;
}

export interface OurClientFormData {
  name: string;
  logo: File | string | null;
  url?: string;
}

export interface OurClientFilters {
  search?: string;
}
