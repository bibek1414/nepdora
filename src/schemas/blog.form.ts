import * as z from "zod";

export const blogFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  content: z.string().min(10, "Content is required."),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  thumbnail_image: z.any().optional(),
  thumbnail_image_alt_description: z.string().optional(),
  category_id: z.number().nullable().optional(),
  tag_ids: z.array(z.number()).optional(),
  time_to_read: z.string().optional(),
});

export type BlogFormValues = z.infer<typeof blogFormSchema>;
