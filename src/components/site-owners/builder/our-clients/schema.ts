import * as z from "zod";

export const ourClientsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  style: z.enum([
    "our-clients-1",
    "our-clients-2",
    "our-clients-3",
    "our-clients-4",
  ]),
  show_all: z.boolean().default(true),
  limit: z.number().min(1).max(50).default(10),
  client_ids: z.array(z.number()).optional(),
});

export type OurClientsSchema = z.infer<typeof ourClientsSchema>;
