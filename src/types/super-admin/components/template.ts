export interface Template {
  id: number | string;
  slug: string;
  owner_id: number;
  name: string;
  schema_name: string;
}

export interface CreateTemplateRequest {
  name: string;
}

export interface CreateTemplateResponse {
  data: Template;
  message?: string;
}

export interface DeleteTemplateResponse {
  message: string;
  success?: boolean;
}

export type GetTemplatesResponse = Template[] | { data: Template[] };
