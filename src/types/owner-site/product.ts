import { z } from "zod";
import {
  ProductSchema,
  ExtendedProductSchema,
  CreateProductSchema,
  UpdateProductSchema,
} from "@/schemas/product.form";

// Inferred types from schemas
export type Product = z.infer<typeof ProductSchema>;
export type ExtendedProduct = z.infer<typeof ExtendedProductSchema>;
export type CreateProductRequest = z.infer<typeof CreateProductSchema>;
export type UpdateProductRequest = z.infer<typeof UpdateProductSchema>;

// Generic product-like object interface for normalization
export interface ProductLike {
  id: number;
  name?: string;
  title?: string;
  description?: string;
  price: string | number;
  stock?: number;
  [key: string]: unknown;
}

// Pagination related types
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationInfo {
  page: number;
  limit: number;
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

export const normalizeProductForCart = (product: ProductLike): Product => {
  return {
    id: product.id,
    name: product.name || product.title || "Unknown Product",
    description: product.description || "",
    price:
      typeof product.price === "string"
        ? product.price
        : product.price?.toString() || "0",
    stock: product.stock || 0,
  };
};
