/**
 * <h3>Grouping</h3>
 * @see https://hono.dev/docs/api/routing#grouping
 */
import { serve } from "@hono/node-server";
import { Hono } from "hono";

// book routes
const book = new Hono();
book.get("/", (c) => c.text("List Books")); // GET /book
book.get("/:id", (c) => {
  // GET /book/:id
  const id = c.req.param("id");
  return c.text("Get Book: " + id);
});
book.post("/", (c) => c.text("Create Book")); // POST /book

// user routes
const user = new Hono();
user.get("/", (c) => c.text("List Users")); // GET /user
user.post("/", (c) => c.text("Create User")); // POST /user

// main app
const app = new Hono();
app.route("/book", book);
app.route("/user", user);

serve(app);
