export interface CategoryData {
  component_id?: string;
  component_type: "category";
  style: "grid-1" | "grid-2" | "list-1" | "carousel-1";
  title: string;
  subtitle?: string;
  limit: number;
  showPagination?: boolean;
  itemsPerRow?: number;
  showDescription?: boolean;
  showProductCount?: boolean;
  order?: number;
}

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
  style: "grid-1",
  title: "Our Categories",
  subtitle: "Browse our product categories",
  limit: 8,
  showPagination: false,
  itemsPerRow: 4,
  showDescription: true,
  showProductCount: true,
};
