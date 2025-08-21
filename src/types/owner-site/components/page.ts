export interface Page {
  id: number;
  title: string;
  slug: string;
}

export interface CreatePageRequest {
  title: string;
}

export interface UpdatePageRequest {
  title?: string;
}

export type GetPageResponse = Page;
export type CreatePageResponse = Page;
export type UpdatePageResponse = Page;

export interface DeletePageResponse {
  message?: string;
  success?: boolean;
}
