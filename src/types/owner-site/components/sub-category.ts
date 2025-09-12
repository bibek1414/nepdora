export interface SubCategoryData {
  component_id?: string;
  component_type: "subcategory";
  style: "grid-1" | "grid-2" | "list-1" | "carousel-1";
  title: string;
  subtitle?: string;
  limit: number;
  showPagination?: boolean;
  itemsPerRow?: number;
  showDescription?: boolean;
  showProductCount?: boolean;
  showParentCategory?: boolean;
  parentCategoryId?: number;
  order?: number;
}

export interface SubCategoryComponentData {
  id: string | number;
  component_id: string;
  component_type: "subcategory";
  data: SubCategoryData;
  order?: number;
  page?: string;
}

// Default data for subcategory component
export const defaultSubCategoryData: SubCategoryData = {
  component_type: "subcategory",
  style: "grid-1",
  title: "Our SubCategories",
  subtitle: "Explore specific product subcategories",
  limit: 8,
  showPagination: false,
  itemsPerRow: 4,
  showDescription: true,
  showProductCount: true,
  showParentCategory: true,
};
