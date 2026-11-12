/**
 * <h3>Getting Started</h3>
 * @see https://hono.dev/docs/getting-started/basic
 */
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

// Return JSON
app.get("/api/hello", (c) => {
  return c.json({
    ok: true,
    message: "Hello Hono!",
  });
});

// Request and Response
app.get("/posts/:id", (c) => {
  const page = c.req.query("page");
  const id = c.req.param("id");
  c.header("X-Message", "Hi!");
  return c.text(`You want to see ${page} of ${id}`);
});

app.post("/posts", (c) => c.text("Created!", 201));

app.delete("/posts/:id", (c) => c.text(`${c.req.param("id")} is deleted!`));

serve(app, (info) => console.log(`Server is listening on port ${info.port}`));
