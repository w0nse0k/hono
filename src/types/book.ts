import z from "zod";

export const BookSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
  price: z.coerce.number(),
  description: z.string(),
  image: z.string(),
  created_at: z.date(),
});

export type Book = z.infer<typeof BookSchema>;
