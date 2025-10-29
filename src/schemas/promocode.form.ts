import { z } from "zod";

export const CreatePromoCodeSchema = z
  .object({
    code: z
      .string()
      .min(1, "Code is required")
      .max(10, "Code must be 10 characters or less")
      .regex(
        /^[A-Z0-9]+$/,
        "Code must contain only uppercase letters and numbers"
      ),
    discount_percentage: z
      .number()
      .min(0, "Discount must be at least 0%")
      .max(100, "Discount cannot exceed 100%"),
    valid_from: z.string().min(1, "Start date is required"),
    valid_to: z.string().min(1, "End date is required"),
    max_uses: z.number().nullable().optional(),
    is_active: z.boolean().default(true),
  })
  .refine(data => new Date(data.valid_to) > new Date(data.valid_from), {
    message: "End date must be after start date",
    path: ["valid_to"],
  });

export type CreatePromoCodeFormData = z.infer<typeof CreatePromoCodeSchema>;
