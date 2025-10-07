export interface PortfolioTag {
  id: number;
  name: string;
  slug: string;
}

export interface PortfolioCategory {
  id: number;
  name: string;
  slug: string;
}

export interface Portfolio {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail_image: string | null;
  thumbnail_image_alt_description: string | null;
  category: PortfolioCategory;
  tags: PortfolioTag[];
  project_url: string | null;
  github_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedPortfolioResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Portfolio[];
}

export interface PortfolioFilters {
  tags?: string[];
  category?: string;
  search?: string;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface CreatePortfolio {
  title: string;
  content: string;
  thumbnail_image?: File | null;
  thumbnail_image_alt_description?: string;
  category: number;
  tags?: number[];
  project_url?: string;
  github_url?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface UpdatePortfolio extends Partial<CreatePortfolio> {
  id: number;
}
