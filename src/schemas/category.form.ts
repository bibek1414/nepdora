import { z } from "zod";

export const categorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  slug: z.string(),
  description: z.string().min(1, "Description is required"),
  image: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  image: z.instanceof(File).optional().nullable(),
});

export const updateCategorySchema = createCategorySchema.extend({
  id: z.number(),
});

export type CategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
