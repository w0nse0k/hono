import { Hono } from "hono";
import {
  addBook,
  deleteBook,
  getBook,
  listBooks,
  updateBook,
} from "../database/book-dao.js";
import { BookSchema, type Book } from "../types/book.js";
import { openApi } from "hono-zod-openapi";
import { z } from "zod";
import { UpsertSchema } from "../types/upsert-result.js";

const bookRoutes = new Hono();

bookRoutes.get(
  "/",
  openApi({
    tags: ["Books"],
    summary: "책 목록",
    request: {
      query: z.object({ page: z.coerce.number(), size: z.coerce.number() }),
    },
    responses: {
      200: BookSchema.array(),
    },
  }),
  async (c) => {
    const { size, page } = c.req.query();
    const list = await listBooks(Number(size), Number(page));
    return c.json(list);
  },
);

bookRoutes.get(
  "/:id",
  openApi({
    tags: ["Books"],
    summary: "책 1권",
    request: { param: z.object({ id: z.coerce.number() }) },
    responses: { 200: BookSchema },
  }),
  async (c) => {
    const { id } = c.req.param();
    const book = await getBook(id);
    return c.json(book);
  },
);

bookRoutes.post(
  "/",
  openApi({
    tags: ["Books"],
    summary: "책 등록",
    request: { json: BookSchema.omit({ id: true, created_at: true }) },
    responses: { 200: UpsertSchema },
  }),
  async (c) => {
    const book: Book = await c.req.json();
    const result = await addBook(book);
    return c.json(result);
  },
);

bookRoutes.put(
  "/",
  openApi({
    tags: ["Books"],
    summary: "책 수정",
    request: { json: BookSchema.omit({ created_at: true }) },
    responses: { 200: UpsertSchema },
  }),
  async (c) => {
    const book: Book = await c.req.json();
    const result = await updateBook(book);
    return c.json(result);
  },
);

bookRoutes.delete(
  "/",
  openApi({
    tags: ["Books"],
    summary: "책 삭제",
    request: { json: z.object({ id: z.coerce.number() }) },
    responses: { 200: UpsertSchema },
  }),
  async (c) => {
    const { id } = await c.req.json();
    const result = await deleteBook(id);
    return c.json(result);
  },
);

export default bookRoutes;
