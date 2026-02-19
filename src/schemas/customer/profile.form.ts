import { z } from "zod";

export const profileSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .optional()
    .nullable(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .optional()
    .nullable(),
});

export type ProfileFormValues = z.infer<typeof profileSchema> & {
  id?: number;
  image?: string | null;
};
