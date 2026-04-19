export interface VideoTestimonial {
  id: number;
  name: string;
  description: string;
  website_name: string;
  website_url: string;
  video_url: string;
  created_at: string;
  updated_at: string;
}

export interface VideoTestimonialResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VideoTestimonial[];
}

export interface CreateVideoTestimonialData {
  name: string;
  video_url: string;
  // Optional fields as per API but not required in form as per user request
  description?: string;
  website_name?: string;
  website_url?: string;
}

export interface UpdateVideoTestimonialData extends Partial<CreateVideoTestimonialData> {}
