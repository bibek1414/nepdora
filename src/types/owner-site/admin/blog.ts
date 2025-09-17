export interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

export interface BlogAuthor {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}
export interface BlogPost {
  id: number;
  author: BlogAuthor | null;
  title: string;
  slug: string;
  content: string;
  thumbnail_image: string | null;
  thumbnail_image_alt_description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  tags: BlogTag[];
  created_at: string;
  updated_at: string;
  is_published?: boolean;
  time_to_read?: string;
}
export interface PaginatedBlogResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BlogPost[];
}

export interface BlogFilters {
  tags?: string[];
  author?: string;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
  is_published?: boolean;
}

export interface CreateBlogPost {
  title: string;
  content: string;
  thumbnail_image?: File | null;
  thumbnail_image_alt_description?: string;
  meta_title?: string;
  meta_description?: string;
  tag_ids?: number[];
  is_published?: boolean;
}

export interface UpdateBlogPost extends Partial<CreateBlogPost> {
  id: number;
}
