import { Hono } from "hono";
import { listBooks } from "../database/book-dao.js";

const bookRoutes = new Hono();

bookRoutes.get("/", async (c) => {
  const { size, page } = c.req.query();
  const list = await listBooks(Number(size), Number(page));
  return c.json(list);
});

export default bookRoutes;
