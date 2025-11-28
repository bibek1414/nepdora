export interface CategoryComponentData {
  id: string | number;
  component_id: string;
  component_type: "category";
  data: CategoryData;
  order?: number;
  page?: string;
}

export const defaultCategoryData: CategoryData = {
  style: "category-1",
  title: "Our Categories",
  subtitle: "Browse our product categories",
};

export interface FeaturedContent {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  backgroundImages?: string[];
  currentImageIndex?: number;
}

export interface CategoryData {
  component_id?: string;
  style:
    | "category-1"
    | "category-2"
    | "category-3"
    | "category-4"
    | "category-5"
    | "category-6"
    | "category-7";

  title: string;
  subtitle?: string;
  order?: number;
  featuredContent?: FeaturedContent;
}
