import { Product } from "@/types/owner-site/admin/product";

// Filter utility functions
export const productFilters = {
  // Get featured products
  getFeaturedProducts: (products: Product[]): Product[] => {
    return products.filter(product => product.is_featured === true);
  },

  // Get popular products
  getPopularProducts: (products: Product[]): Product[] => {
    return products.filter(product => product.is_popular === true);
  },

  // Get products by subcategory ID
  getProductsBySubCategory: (
    products: Product[],
    subCategoryId: number
  ): Product[] => {
    return products.filter(
      product => product.sub_category?.id === subCategoryId
    );
  },

  // Get products by category ID
  getProductsByCategory: (
    products: Product[],
    categoryId: number
  ): Product[] => {
    return products.filter(product => product.category?.id === categoryId);
  },

  // Get products by multiple criteria
  getFilteredProducts: (
    products: Product[],
    filters: {
      isFeatured?: boolean;
      isPopular?: boolean;
      categoryId?: number;
      subCategoryId?: number;
      status?: "active" | "draft" | "archived";
      fastShipping?: boolean;
    }
  ): Product[] => {
    return products.filter(product => {
      if (
        filters.isFeatured !== undefined &&
        product.is_featured !== filters.isFeatured
      ) {
        return false;
      }
      if (
        filters.isPopular !== undefined &&
        product.is_popular !== filters.isPopular
      ) {
        return false;
      }
      if (
        filters.categoryId !== undefined &&
        product.category?.id !== filters.categoryId
      ) {
        return false;
      }
      if (
        filters.subCategoryId !== undefined &&
        product.sub_category?.id !== filters.subCategoryId
      ) {
        return false;
      }
      if (filters.status !== undefined && product.status !== filters.status) {
        return false;
      }
      if (
        filters.fastShipping !== undefined &&
        product.fast_shipping !== filters.fastShipping
      ) {
        return false;
      }
      return true;
    });
  },
};

// Product selection types for your website builder
export type ProductSelectionType =
  | "all"
  | "featured"
  | "popular"
  | "category"
  | "subcategory"
  | "custom";

export interface ProductSelectionConfig {
  type: ProductSelectionType;
  categoryId?: number;
  subCategoryId?: number;
  limit?: number;
  customFilters?: {
    isFeatured?: boolean;
    isPopular?: boolean;
    fastShipping?: boolean;
    status?: "active" | "draft" | "archived";
  };
}

// Main function to get products based on selection config
export const getProductsBySelection = (
  allProducts: Product[],
  config: ProductSelectionConfig
): Product[] => {
  let filteredProducts: Product[] = [];

  switch (config.type) {
    case "all":
      filteredProducts = allProducts;
      break;

    case "featured":
      filteredProducts = productFilters.getFeaturedProducts(allProducts);
      break;

    case "popular":
      filteredProducts = productFilters.getPopularProducts(allProducts);
      break;

    case "category":
      if (config.categoryId) {
        filteredProducts = productFilters.getProductsByCategory(
          allProducts,
          config.categoryId
        );
      }
      break;

    case "subcategory":
      if (config.subCategoryId) {
        filteredProducts = productFilters.getProductsBySubCategory(
          allProducts,
          config.subCategoryId
        );
      }
      break;

    case "custom":
      if (config.customFilters) {
        filteredProducts = productFilters.getFilteredProducts(
          allProducts,
          config.customFilters
        );
      }
      break;

    default:
      filteredProducts = allProducts;
  }

  // Apply limit if specified
  if (config.limit && config.limit > 0) {
    filteredProducts = filteredProducts.slice(0, config.limit);
  }

  return filteredProducts;
};

// Hook for React components
export const useProductSelection = (
  products: Product[],
  config: ProductSelectionConfig
) => {
  return getProductsBySelection(products, config);
};
