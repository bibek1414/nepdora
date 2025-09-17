export interface FAQ {
  id: number;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface CreateFAQRequest {
  question: string;
  answer: string;
}

export interface UpdateFAQRequest {
  question?: string;
  answer?: string;
}

export type CreateFAQResponse = FAQ;
export type UpdateFAQResponse = FAQ;
export type GetFAQResponse = FAQ;

export interface DeleteFAQResponse {
  success: boolean;
  message: string;
}
