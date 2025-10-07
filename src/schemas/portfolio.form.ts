import * as z from "zod";

export const portfolioFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  content: z.string().min(10, "Content is required."),
  category: z.number().refine(val => val !== null && val !== undefined, {
    message: "Please select a category.",
  }),

  meta_title: z
    .string()
    .max(60, "Meta title should be under 60 characters.")
    .optional(),
  meta_description: z
    .string()
    .max(160, "Meta description should be under 160 characters.")
    .optional(),
  thumbnail_image: z.any().optional(),
  thumbnail_image_alt_description: z.string().optional(),
  tags: z.array(z.number()).optional(),
  project_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  github_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

export type PortfolioFormValues = z.infer<typeof portfolioFormSchema>;
