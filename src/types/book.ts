import { z } from "zod";

export const BookSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  created_at: z.date(),
});

export type Book = z.infer<typeof BookSchema>;
