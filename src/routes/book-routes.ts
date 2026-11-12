import { Hono } from "hono";
import {
  addBook,
  deleteBook,
  getBook,
  listBooks,
  updateBook,
} from "../database/book-dao.js";
import type { Book } from "../types/book.js";
import { HTTPException } from "hono/http-exception";

const bookRoutes = new Hono();

bookRoutes.get("/", async (c) => {
  const { size = 10, page = 1 } = c.req.query();
  const list = await listBooks(Number(size), Number(page));
  return c.json(list);
});

bookRoutes.get("/:id", async (c) => {
  const { id } = c.req.param();
  const book = await getBook(Number(id));
  // 책이 없으면 404 Not Found
  if (!book) throw new HTTPException(404);
  return c.json(book);
});

bookRoutes.post("/", async (c) => {
  const book: Book = await c.req.json();
  const result = await addBook(book);
  return c.json(result);
});

bookRoutes.patch("/", async (c) => {
  const book: Book = await c.req.json();
  const result = await updateBook(book);
  // 업데이트가 안될 경우 요청의 id가 잘못됨. 400 Bad Request
  if (result.affectedRows === 0) throw new HTTPException(400);
  return c.json(result);
});

bookRoutes.delete("/:id", async (c) => {
  const id = await c.req.param("id");
  const result = await deleteBook(Number(id));
  // 삭제가 안될 경우 요청의 id가 잘못됨. 400 Bad Request
  if (result.affectedRows === 0) throw new HTTPException(400);
  return c.json(result);
});

export default bookRoutes;
