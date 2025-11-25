// schemas/signup.form.ts
import * as z from "zod";

export const websiteTypeEnum = z.enum(["ecommerce", "service"]);

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required." })
      .email({ message: "Please enter a valid email address." }),
    phone: z
      .string()
      .min(1, { message: "Phone number is required." })
      .regex(/^\d+$/, { message: "Phone number should contain only numbers." })
      .min(10, { message: "Phone number must be at least 10 digits." })
      .max(15, { message: "Phone number cannot exceed 15 digits." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number.",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password." }),
    store_name: z
      .string()
      .min(1, { message: "Store name is required." })
      .min(3, { message: "Store name must be at least 3 characters long." })
      .max(50, { message: "Store name cannot exceed 50 characters." })
      .regex(/^[a-zA-Z0-9\s_-]+$/, {
        message:
          "Store name can only contain letters, numbers, spaces, hyphens, and underscores.",
      }),
    website_type: websiteTypeEnum,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
