import * as z from "zod";

export const servicesFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long."),
  description: z.string().min(10, "Description is required."),
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
});

export type ServicesFormValues = z.infer<typeof servicesFormSchema>;
