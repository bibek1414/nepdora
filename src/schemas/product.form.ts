import { z } from "zod";

// Base Product Schema
export const ProductSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  stock: z.number().min(0, "Stock cannot be negative"),
});

// Extended Product Schema (for external APIs)
export const ExtendedProductSchema = ProductSchema.extend({
  title: z.string().optional(),
  discountPercentage: z.number().optional(),
  rating: z.number().optional(),
  brand: z.string().optional(),
  category: z.string().optional(),
  thumbnail: z.string().optional(),
  images: z.array(z.string()).optional(),
});

// Create & Update Schemas
export const CreateProductSchema = ProductSchema.omit({ id: true });
export const UpdateProductSchema = ProductSchema.partial().omit({ id: true });
