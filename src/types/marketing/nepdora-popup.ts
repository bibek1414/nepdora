export interface NepdoraPopupFormData {
  name: string;
  email?: string;
  phone_number?: string;
  message?: string;
  website_type?: string;
}

export interface NepdoraPopupSubmission extends NepdoraPopupFormData {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface NepdoraPopupListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NepdoraPopupSubmission[];
}

export interface NepdoraPopupFilters {
  page?: number;
  page_size?: number;
}
