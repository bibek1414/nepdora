export interface SubCategoryData {
  component_id?: string;
  style: "subcategory-1" | "subcategory-2" | "subcategory-3" | "subcategory-4";
  title: string;
  subtitle?: string;
  parentCategoryId?: number;
  order?: number;
}

export interface SubCategoryComponentData {
  id: string | number;
  component_type: "subcategory";
  component_id: string;
  data: SubCategoryData;
  order?: number;
  page?: string;
}

// Default data for subcategory component
export const defaultSubCategoryData: SubCategoryData = {
  style: "subcategory-1",
  title: "Our SubCategories",
  subtitle: "Explore specific product subcategories",
};
