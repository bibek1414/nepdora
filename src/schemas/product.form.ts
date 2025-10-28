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
    if (!file) return true;
    if (typeof file === "string") return true;
    return file.size <= MAX_FILE_SIZE;
  }, `Max file size is 5MB.`)
  .refine(file => {
    if (!file) return true;
    if (typeof file === "string") return true;
    return ACCEPTED_IMAGE_TYPES.includes(file.type);
  }, ".jpg, .jpeg, .png and .webp files are accepted.")
  .optional()
  .nullable();

// Variant Schemas
export const ProductOptionValueSchema = z.object({
  id: z.number(),
  value: z.string(),
  option: z.number().optional(),
});

export const ProductOptionSchema = z.object({
  id: z.number(),
  name: z.string(),
  product: z.number().optional(),
  values: z.array(ProductOptionValueSchema).optional(),
});

export const ProductVariantSchema = z.object({
  id: z.number(),
  price: z.string().nullable(),
  stock: z.number().nullable(),
  image: z.string().nullable(),
  option_values: z.array(z.number()),
  product: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ProductVariantReadSchema = z.object({
  id: z.number(),
  price: z.string(),
  stock: z.number(),
  image: z.string().nullable(),
  option_values: z.record(z.string(), z.string()),
});

// Category Reference Schema
export const CategoryReferenceSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

// Subcategory Reference Schema
export const SubCategoryReferenceSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

// Product Image Schema
export const ProductImageSchema = z.object({
  id: z.number(),
  image: z.string(),
});

// Status choices
export const STATUS_CHOICES = ["active", "draft", "archived"] as const;

// Base Product Schema with NEW FIELDS
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().nullable(),
  description: z.string().nullable(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  market_price: z.string().nullable(),
  track_stock: z.boolean().optional(),
  stock: z.number().min(0, "Stock cannot be negative").default(0),
  weight: z.string().nullable().optional(),
  thumbnail_image: z.string().nullable(),
  images: z.array(ProductImageSchema).optional(),
  thumbnail_alt_description: z.string().nullable(),
  category: CategoryReferenceSchema.nullable(),
  sub_category: SubCategoryReferenceSchema.nullable(),
  is_popular: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  is_wishlist: z.boolean().optional(),
  status: z.enum(STATUS_CHOICES).default("active"),
  meta_title: z.string().nullable().optional(),
  meta_description: z.string().nullable().optional(),
  // NEW FIELDS
  fast_shipping: z.boolean().default(false),
  warranty: z.string().max(20).nullable().optional(),
  average_rating: z.number().min(0).max(5).optional(),
  reviews_count: z.number().min(0).optional(),
  options: z.array(ProductOptionSchema).optional(),
  variants: z.array(ProductVariantSchema).optional(),
  variants_read: z.array(ProductVariantReadSchema).optional(),
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

// Create Variant Schema for form submission
export const CreateVariantSchema = z.object({
  price: z.string().optional(),
  stock: z.number().min(0, "Stock cannot be negative"),
  image: imageSchema,
  options: z.record(z.string(), z.string()),
});

// Create Product Option Schema for form submission
export const CreateProductOptionSchema = z.object({
  name: z.string().min(1, "Option name is required"),
  values: z.array(z.string()).min(1, "At least one value is required"),
});

// Create Product Schema with NEW FIELDS
export const CreateProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  market_price: z.string().optional(),
  stock: z.number().min(0, "Stock cannot be negative"),
  thumbnail_image: imageSchema,
  image_files: z.array(z.any()).optional(),
  thumbnail_alt_description: z.string().optional(),
  category_id: z.string().optional(),
  sub_category_id: z.string().optional(),
  track_stock: z.boolean(),
  is_popular: z.boolean(),
  is_featured: z.boolean(),
  // NEW FIELDS - make them optional in the schema but provide defaults in the form
  fast_shipping: z.boolean(),
  warranty: z
    .string()
    .max(20, "Warranty must be 20 characters or less")
    .optional(),
  weight: z
    .string()
    .max(100, "Weight must be 100 characters or less")
    .optional(),
  status: z.enum(STATUS_CHOICES),
  meta_title: z
    .string()
    .max(255, "Meta title must be 255 characters or less")
    .optional(),
  meta_description: z.string().optional(),
  // Variant-related fields
  options: z.array(CreateProductOptionSchema).optional(),
  variants: z.array(CreateVariantSchema).optional(),
});

// Update Product Schema
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
  category: z.string().min(1, "Category is required"),
  image: imageSchema,
});

// Update Subcategory Schema
export const UpdateSubCategorySchema = CreateSubCategorySchema.partial();
