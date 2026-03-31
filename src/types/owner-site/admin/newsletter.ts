export interface Newsletter {
  id: number;
  email: string;
  is_subscribed: boolean;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateNewsletterRequest {
  email: string;
  is_subscribed?: boolean;
  website_url?: string;
}

export interface CreateNewsletterResponse {
  success: boolean;
  data: Newsletter;
  message: string;
}

export interface GetNewslettersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Newsletter[];
}
