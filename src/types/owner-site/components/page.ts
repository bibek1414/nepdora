export interface Page {
  id: number;
  title: string;
  slug: string;
  meta_title?: string | null;
  meta_description?: string | null;
}

export interface CreatePageRequest {
  title: string;
  meta_title?: string;
  meta_description?: string;
}

export interface UpdatePageRequest {
  title?: string;
  meta_title?: string;
  meta_description?: string;
}

export type GetPageResponse = Page;
export type CreatePageResponse = Page;
export type UpdatePageResponse = Page;

export interface DeletePageResponse {
  message?: string;
  success?: boolean;
}
