export interface Template {
  id: number | string;
  slug: string;
  owner_id: number;
  name: string;
  template_image?: string;
  schema_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTemplateRequest {
  name: string;
}

export interface UpdateTemplateRequest {
  template_image?: File;
}

export interface CreateTemplateResponse {
  data: Template;
  message?: string;
}

export interface UpdateTemplateResponse {
  data: Template;
  message?: string;
}

export interface DeleteTemplateResponse {
  message: string;
  success?: boolean;
}

export interface PaginatedTemplatesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Template[];
}

export type GetTemplatesResponse =
  | Template[]
  | PaginatedTemplatesResponse
  | { data: Template[] };
