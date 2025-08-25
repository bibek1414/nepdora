import { z } from "zod";

// File upload schema
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const imageSchema = z
  .any()
  .refine(file => {
    if (!file) return true; // Allow null/undefined
    if (typeof file === "string") return true; // Allow existing image URLs
    return file.size <= MAX_FILE_SIZE;
  }, `Max file size is 5MB.`)
  .refine(file => {
    if (!file) return true; // Allow null/undefined
    if (typeof file === "string") return true; // Allow existing image URLs
    return ACCEPTED_IMAGE_TYPES.includes(file.type);
  }, ".jpg, .jpeg, .png and .webp files are accepted.")
  .optional()
  .nullable();

// Category Reference Schema (for nested objects)
export const CategoryReferenceSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

// Subcategory Reference Schema (for nested objects)
export const SubCategoryReferenceSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

// Product Image Schema (for the nested array in the API response)
export const ProductImageSchema = z.object({
  id: z.number(),
  image: z.string(),
});

// Base Product Schema (matches API response)
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().nullable(),
  description: z.string().nullable(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  market_price: z.string().nullable(),
  stock: z.number().min(0, "Stock cannot be negative"),
  thumbnail_image: z.string().nullable(),
  images: z.array(ProductImageSchema).optional(), // <-- Added this
  thumbnail_alt_description: z.string().nullable(),
  category: CategoryReferenceSchema.nullable(),
  sub_category: SubCategoryReferenceSchema.nullable(),
  is_popular: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Category Schema
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Subcategory Schema
export const SubCategorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().nullable(),
  category: z.union([z.string(), CategoryReferenceSchema]).nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Create Product Schema (for form submission)
export const CreateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  market_price: z.string().optional(),
  stock: z.number().min(0, "Stock cannot be negative"),
  thumbnail_image: imageSchema,
  images: z.array(z.any()).optional(), // <-- Added this for multiple file uploads
  thumbnail_alt_description: z.string().optional(),
  category: z.string().optional(),
  sub_category: z.string().optional(),
  is_popular: z.boolean(),
  is_featured: z.boolean(),
});

// Update Product Schema (partial of create schema)
export const UpdateProductSchema = CreateProductSchema.partial();

// Create Category Schema
export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  image: imageSchema,
});

// Update Category Schema
export const UpdateCategorySchema = CreateCategorySchema.partial();

// Create Subcategory Schema
export const CreateSubCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"), // Category ID as string
  image: imageSchema,
});

// Update Subcategory Schema
export const UpdateSubCategorySchema = CreateSubCategorySchema.partial();
