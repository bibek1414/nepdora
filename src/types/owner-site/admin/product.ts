import { z } from "zod";
import {
  ProductSchema,
  CreateProductSchema,
  UpdateProductSchema,
  CategorySchema,
  SubCategorySchema,
  CreateCategorySchema,
  UpdateCategorySchema,
  CreateSubCategorySchema,
  UpdateSubCategorySchema,
  ProductOptionSchema,
  ProductVariantSchema,
  ProductVariantReadSchema,
  CreateVariantSchema,
  CreateProductOptionSchema,
} from "@/schemas/product.form";

// Inferred types from schemas
export type Product = z.infer<typeof ProductSchema>;
export type CreateProductRequest = z.infer<typeof CreateProductSchema>;
export type UpdateProductRequest = z.infer<typeof UpdateProductSchema>;

// Category and Subcategory types
export type Category = z.infer<typeof CategorySchema>;
export type SubCategory = z.infer<typeof SubCategorySchema>;
export type CreateCategoryRequest = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryRequest = z.infer<typeof UpdateCategorySchema>;
export type CreateSubCategoryRequest = z.infer<typeof CreateSubCategorySchema>;
export type UpdateSubCategoryRequest = z.infer<typeof UpdateSubCategorySchema>;

// Variant types
export type ProductOption = z.infer<typeof ProductOptionSchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
export type ProductVariantRead = z.infer<typeof ProductVariantReadSchema>;
export type CreateVariant = z.infer<typeof CreateVariantSchema>;
export type CreateProductOption = z.infer<typeof CreateProductOptionSchema>;

export interface ExtendedProduct extends Product {
  [key: string]: unknown;
}

// Generic product-like object interface for normalization
export interface ProductLike {
  id: number;
  name?: string | null;
  title?: string | null;
  description?: string | null;
  price: string | number;
  stock?: number | null;
  // NEW FIELDS
  fast_shipping?: boolean;
  warranty?: string | null;
  weight?: string | null;
  status?: "active" | "draft" | "archived";
  meta_title?: string | null;
  meta_description?: string | null;
  [key: string]: unknown;
}

// Pagination related types
export interface PaginationParams {
  page?: number;
  page_size?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category?: number;
}

export interface PaginationInfo {
  page: number;
  page_size: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface GetProductsResponse {
  results: Product[];
  count: number;
  next: string | null;
  previous: string | null;
  pagination: PaginationInfo;
}

export interface GetCategoriesResponse {
  results: Category[];
  count: number;
  next: string | null;
  previous: string | null;
  pagination: PaginationInfo;
}

export interface GetSubCategoriesResponse {
  results: SubCategory[];
  count: number;
  next: string | null;
  previous: string | null;
  pagination: PaginationInfo;
}

export interface CreateProductResponse {
  data: Product;
  message: string;
}

export interface UpdateProductResponse {
  data: Product;
  message: string;
}

export interface DeleteProductResponse {
  message: string;
}

export interface CreateCategoryResponse {
  data: Category;
  message: string;
}

export interface UpdateCategoryResponse {
  data: Category;
  message: string;
}

export interface DeleteCategoryResponse {
  message: string;
}

export interface CreateSubCategoryResponse {
  data: SubCategory;
  message: string;
}

export interface UpdateSubCategoryResponse {
  data: SubCategory;
  message: string;
}

export interface DeleteSubCategoryResponse {
  message: string;
}

export const normalizeProductForCart = (product: ProductLike): Product => {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productData = product as any;

  return {
    id: product.id,
    name: product.name || product.title || "Unknown Product",
    slug: productData.slug || null,
    price:
      typeof product.price === "string"
        ? product.price
        : product.price?.toString() || "0",
    market_price: productData.market_price || null,
    description: product.description || null,
    track_stock: productData.track_stock ?? true,
    stock:
      typeof product.stock === "number"
        ? product.stock
        : productData.stock || 0,
    weight: productData.weight || null,
    thumbnail_image: productData.thumbnail_image || null,
    images: productData.images || [],
    thumbnail_alt_description: productData.thumbnail_alt_description || null,
    category: productData.category || null,
    sub_category: productData.sub_category || null,
    is_popular: productData.is_popular || false,
    is_featured: productData.is_featured || false,
    // NEW FIELDS
    fast_shipping: productData.fast_shipping ?? false,
    warranty: productData.warranty || null,
    status: productData.status || "active",
    meta_title: productData.meta_title || null,
    meta_description: productData.meta_description || null,
    options: productData.options || [],
    variants: productData.variants || [],
    variants_read: productData.variants_read || [],
    created_at: productData.created_at || new Date().toISOString(),
    updated_at: productData.updated_at || new Date().toISOString(),
  };
};
