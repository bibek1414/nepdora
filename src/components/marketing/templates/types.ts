export interface Category {
  key: string;
  label: string;
}

export type CategoryKey = string;

export interface Template {
  id: number;
  name: string;
  description?: string;
  image?: string;
  featured?: boolean;
}
