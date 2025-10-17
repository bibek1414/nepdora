export interface FAQCategory {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFAQCategoryRequest {
  name: string;
}

export interface UpdateFAQCategoryRequest {
  name?: string;
}

export type CreateFAQCategoryResponse = FAQCategory;
export type UpdateFAQCategoryResponse = FAQCategory;
export type GetFAQCategoryResponse = FAQCategory;

export interface DeleteFAQCategoryResponse {
  success: boolean;
  message: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: number;
  created_at: string;
  updated_at: string;
}

export interface CreateFAQRequest {
  question: string;
  answer: string;
  category: number;
}

export interface UpdateFAQRequest {
  question?: string;
  answer?: string;
  category?: number;
}

export type CreateFAQResponse = FAQ;
export type UpdateFAQResponse = FAQ;
export type GetFAQResponse = FAQ;

export interface DeleteFAQResponse {
  success: boolean;
  message: string;
}
