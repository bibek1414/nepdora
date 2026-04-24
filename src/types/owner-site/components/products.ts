export interface ProductsData {
  component_id?: string;
  style:
    | "product-1"
    | "product-2"
    | "product-3"
    | "product-4"
    | "product-5"
    | "product-6"
    | "product-7"
    | "product-8"
    | "product-9"
    | "product-10"
    | "product-11"
    | "product-12";

  title: string;
  subtitle?: string;
  order?: number;
  categoryId?: number;
  subCategoryId?: number;
  category?: string | null;
  subCategory?: string | null;
  buttonText?: string;
  buttonLink?: string;
  display_type?: "grid" | "carousel";
  carousel_style?: "style-5" | "style-10";
  page_size?: number;
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
  style: "product-1",
  title: "Our Products",
  subtitle: "Discover our amazing collection of products",
};

export const DEFAULT_PRODUCTS_MAP: Record<ProductsData["style"], ProductsData> =
  {
    "product-1": { ...defaultProductsData, style: "product-1" },
    "product-2": { ...defaultProductsData, style: "product-2" },
    "product-3": { ...defaultProductsData, style: "product-3" },
    "product-4": { ...defaultProductsData, style: "product-4" },
    "product-5": {
      ...defaultProductsData,
      style: "product-5",
      title: "Featured Collection",
    },
    "product-6": {
      ...defaultProductsData,
      style: "product-6",
      title: "Best Selling",
    },
    "product-7": {
      ...defaultProductsData,
      style: "product-7",
      title: "Featured Collections",
      subtitle: "Top sale on this week",
    },
    "product-8": {
      ...defaultProductsData,
      style: "product-8",
      title: "New Arrivals",
      subtitle: "Discover the latest additions to our collection",
      buttonText: "View All Products",
      buttonLink: "#",
    },
    "product-9": {
      ...defaultProductsData,
      style: "product-9",
      title: "Featured Products",
    },
    "product-10": {
      ...defaultProductsData,
      style: "product-10",
      title: "Products Carousel",
    },
    "product-11": {
      ...defaultProductsData,
      style: "product-11",
      title: "Best Selling Products",
    },
    "product-12": {
      ...defaultProductsData,
      style: "product-12",
      title: "Our Collection",
    },
  };
