export interface TemplateCategory {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
}

export interface TemplateSubcategory {
  id: number;
  name: string;
  slug: string;
  category: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTemplateCategoryRequest {
  name: string;
}

export interface CreateTemplateSubcategoryRequest {
  name: string;
  category_id: number;
}

export interface TemplateCategoryResponse {
  data: TemplateCategory;
  message?: string;
}

export interface TemplateSubcategoryResponse {
  data: TemplateSubcategory;
  message?: string;
}
