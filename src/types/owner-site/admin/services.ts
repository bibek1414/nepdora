export interface ServicesPost {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail_image: string | null;
  thumbnail_image_alt_description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}
export interface PaginatedServicesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ServicesPost[];
}

export interface ServicesFilters {
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface CreateServicesPost {
  title: string;
  description: string;
  thumbnail_image?: File | null;
  thumbnail_image_alt_description?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface UpdateServicesPost extends Partial<CreateServicesPost> {
  id: number;
}
