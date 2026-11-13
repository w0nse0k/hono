import { Hono } from "hono";
import {
  addBook,
  deleteBook,
  getBook,
  listBooks,
  updateBook,
} from "../database/book-dao.js";
import { BookSchema, type Book } from "../types/book.js";
import { HTTPException } from "hono/http-exception";
import { openApi } from "hono-zod-openapi";
import { z } from "zod";
import { IDSchema, UpsertSchema } from "../types/common.js";

const bookRoutes = new Hono();

const RequiredBookSchema = BookSchema.omit({ id: true, created_at: true });

// 책 목록
bookRoutes.get(
  "/",
  openApi({
    tags: ["Books"],
    summary: "책 목록",
    request: {
      query: z.object({ page: z.coerce.number(), size: z.coerce.number() }),
    },
    responses: { 200: BookSchema.array() },
  }),
  async (c) => {
    const { size = 10, page = 1 } = c.req.valid("query");
    const list = await listBooks(size, page);
    return c.var.res(list);
  },
);

// 책 1 건
bookRoutes.get(
  "/:id",
  openApi({
    tags: ["Books"],
    summary: "책 1건",
    request: { param: IDSchema },
    responses: { 200: BookSchema },
  }),
  async (c) => {
    const { id } = c.req.valid("param");
    const book = await getBook(Number(id));
    // 책이 없으면 404 Not Found
    if (!book) throw new HTTPException(404);
    return c.var.res(book);
  },
);

// 책 추가
bookRoutes.post(
  "/",
  openApi({
    tags: ["Books"],
    summary: "책 등록",
    request: { json: RequiredBookSchema },
    responses: { 200: UpsertSchema },
  }),
  async (c) => {
    const book: Book = await c.req.json();
    const result = await addBook(book);
    return c.var.res(result);
  },
);

// 책 수정
bookRoutes.patch(
  "/:id",
  openApi({
    tags: ["Books"],
    summary: "책 수정",
    request: {
      param: IDSchema,
      json: RequiredBookSchema.partial(),
    },
    responses: { 200: UpsertSchema },
  }),
  async (c) => {
    const { id } = await c.req.valid("param");
    const requested = await c.req.valid("json");
    const current = await getBook(id);
    // 책이 없으면 잘못된 요청. 400 Bad Request
    if (!current) throw new HTTPException(400);
    // 변경된 부분을 반영
    Object.assign(current, requested); // current <- requested
    const result = await updateBook(current);
    return c.var.res(result);
  },
);

// 책 삭제
bookRoutes.delete(
  "/:id",
  openApi({
    tags: ["Books"],
    summary: "책 삭제",
    request: { param: IDSchema },
    responses: { 200: UpsertSchema },
  }),
  async (c) => {
    const { id } = await c.req.valid("param");
    const result = await deleteBook(id);
    // 삭제가 안될 경우 요청의 id가 잘못됨. 400 Bad Request
    if (result.affectedRows === 0) throw new HTTPException(400);
    return c.var.res(result);
  },
);

export default bookRoutes;
