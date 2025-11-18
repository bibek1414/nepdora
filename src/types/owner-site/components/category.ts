export interface CategoryComponentData {
  id: string | number;
  component_id: string;
  component_type: "category";
  data: CategoryData;
  order?: number;
  page?: string;
}

// Default data for category component
export const defaultCategoryData: CategoryData = {
  component_type: "category",
  style: "category-1",
  title: "Our Categories",
  subtitle: "Browse our product categories",
  page_size: 8,
  showPagination: false,
  itemsPerRow: 4,
  showDescription: true,
  showProductCount: true,
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
  component_type: "category";
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
  page_size: number;
  showPagination?: boolean;
  itemsPerRow?: number;
  showDescription?: boolean;
  showProductCount?: boolean;
  order?: number;
  featuredContent?: FeaturedContent;
}
