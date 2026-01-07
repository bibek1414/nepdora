import * as z from "zod";

export const servicesFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().min(10, "Description is required."),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  thumbnail_image: z.any().optional(),
  thumbnail_image_alt_description: z.string().optional(),
  service_category: z.number().nullable().optional(),
});

export type ServicesFormValues = z.infer<typeof servicesFormSchema>;
