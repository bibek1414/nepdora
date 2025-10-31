import * as z from "zod";

export const checkoutFormSchema = z
  .object({
    customer_name: z
      .string()
      .min(2, "Full name must be at least 2 characters long.")
      .max(100, "Full name must be less than 100 characters."),
    customer_email: z
      .string()
      .email("Please enter a valid email address.")
      .min(1, "Email is required."),
    customer_phone: z
      .string()
      .min(10, "Phone number must be at least 10 characters long.")
      .regex(/^[0-9]{7,15}$/, "Please enter a valid phone number.")
      .refine(
        val => !/[+_]/.test(val),
        "Phone number must not contain '+' or '_' symbols."
      ),

    customer_address: z
      .string()
      .min(5, "Billing address must be at least 5 characters long.")
      .max(500, "Billing address must be less than 500 characters."),
    city: z.string().min(1, "Please select your city/district."),
    same_as_customer_address: z.boolean(),
    shipping_address: z.string().optional(),
    shipping_city: z.string().optional(),
    note: z
      .string()
      .max(500, "Order notes must be less than 500 characters.")
      .optional(),
  })
  .refine(
    data => {
      if (!data.same_as_customer_address) {
        return (
          data.shipping_address && data.shipping_address.trim().length >= 5
        );
      }
      return true;
    },
    {
      message: "Shipping address must be at least 5 characters long ",
      path: ["shipping_address"],
    }
  );

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
