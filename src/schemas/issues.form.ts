import { z } from "zod";

// ------------------------
// Issue Category schemas
// ------------------------
export const issueCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(255, "Category name must be less than 255 characters")
    .trim(),
});

export const updateIssueCategorySchema = issueCategorySchema.partial();

// ------------------------
// Issue schemas (for API)
// ------------------------
export const issueSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters")
    .trim(),

  description: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform(val => (val === "" ? undefined : val)),

  priority: z
    .enum(["low", "medium", "high"])
    .refine(val => ["low", "medium", "high"].includes(val), {
      message: "Priority must be low, medium, or high",
    }),

  status: z
    .enum(["pending", "open", "in_progress", "closed"])
    .optional()
    .default("pending")
    .refine(val => ["pending", "open", "in_progress", "closed"].includes(val), {
      message: "Status must be pending,open, in_progress, or closed",
    }),

  issue_category: z
    .number()
    .int()
    .positive("Please select a valid category")
    .optional(),
});

export const updateIssueSchema = issueSchema.partial();

// ------------------------
// Form schemas (used in components) - Simplified
// ------------------------
export const issueFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters")
    .trim(),

  description: z
    .union([z.string(), z.undefined()])
    .transform(val => (val === "" ? undefined : val)),

  priority: z.enum(["low", "medium", "high"]),

  issue_category: z
    .union([z.string(), z.undefined()])
    .transform(val => (val === "" ? undefined : val)),

  new_category: z
    .union([z.string(), z.undefined()])
    .transform(val => (val === "" ? undefined : val)),
});

export const issueCategoryFormSchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(255, "Category name must be less than 255 characters")
    .trim(),
});

// ------------------------
// Type exports
// ------------------------
export type IssueCategoryFormData = z.infer<typeof issueCategorySchema>;
export type UpdateIssueCategoryFormData = z.infer<
  typeof updateIssueCategorySchema
>;
export type IssueFormData = z.infer<typeof issueFormSchema>;
export type UpdateIssueFormData = z.infer<typeof updateIssueSchema>;
export type IssueCategoryFormFormData = z.infer<typeof issueCategoryFormSchema>;
