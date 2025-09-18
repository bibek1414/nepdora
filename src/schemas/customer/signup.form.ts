import * as z from "zod";

export const signupSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
    first_name: z
      .string()
      .min(1, { message: "First name is required." })
      .optional(),
    last_name: z
      .string()
      .min(1, { message: "Last name is required." })
      .optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
