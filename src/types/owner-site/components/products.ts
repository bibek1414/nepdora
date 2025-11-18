export interface ProductsData {
  component_id?: string;
  component_type: "products";
  style:
    | "product-1"
    | "product-2"
    | "product-3"
    | "product-4"
    | "product-5"
    | "product-6"
    | "product-7"
    | "product-8";

  title: string;
  subtitle?: string;
  page_size: number;
  showPagination?: boolean;
  itemsPerRow?: number;
  showPrice?: boolean;
  showDescription?: boolean;
  showStock?: boolean;
  order?: number;
}

export interface ProductsComponentData {
  id: string | number;
  component_id: string;
  component_type: "products";
  data: ProductsData;
  order?: number;
  page?: string;
}

// Default data for products component
export const defaultProductsData: ProductsData = {
  component_type: "products",
  style: "product-1",
  title: "Our Products",
  subtitle: "Discover our amazing collection of products",
  page_size: 8,
  showPagination: false,
  itemsPerRow: 4,
  showPrice: true,
  showDescription: true,
  showStock: true,
};
