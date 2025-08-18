import * as z from 'zod';

export const signupSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email address.' }),
    phone: z.string(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z.string(),
    store_name: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
