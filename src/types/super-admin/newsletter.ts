export interface NepdoraNewsletter {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetNepdoraNewslettersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NepdoraNewsletter[];
}
