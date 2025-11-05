export interface Template {
  id: number | string;
  name: string;
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
