export interface Template {
  id: number;
  name: string;
  description: string;
  image: string;
  featured?: boolean;
}

export type CategoryKey =
  | "portfolio"
  | "business"
  | "ecommerce"
  | "blog"
  | "other";

export interface Category {
  key: CategoryKey;
  label: string;
}

export type TemplateCategories = Record<CategoryKey, Template[]>;

// TemplateCard.tsx

// CategoryNavigation.tsx

// TemplatesPage.tsx
