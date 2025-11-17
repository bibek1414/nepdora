export interface Template {
  id: number;
  name: string;
  schema_name: string;
  owner_id: number;
  created_on: string;
  paid_until: string | null;
  template_image: string | null;
  is_template_account: boolean;
  domains: string[];
}

export interface PaginatedTemplates {
  count: number;
  next: string | null;
  previous: string | null;
  results: Template[];
}

export interface TemplateFilters {
  page?: number;
  page_size?: number;
  search?: string;
}

export interface ImportTemplateRequest {
  template_id: number;
}

export interface ImportTemplateResponse {
  message: string;
  success: boolean;
  schema_name?: string;
}
