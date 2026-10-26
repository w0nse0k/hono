/**
 * Routing - Basic
 * @see https://hono.dev/docs/api/routing#basic
 */
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();
// Serve static files
app.use("/static/*", serveStatic({ root: "./src" }));

// HTTP Methods
app.get("/", (c) => c.text("GET /"));
app.post("/", (c) => c.text("POST /"));
app.put("/", (c) => c.text("PUT /"));
app.delete("/", (c) => c.text("DELETE /"));

// Wildcard
app.get("/wild/*/card", (c) => {
  return c.text("GET /wild/*/card");
});

// Path Parameter
app.get("/user/:name", (c) => {
  const name = c.req.param("name");
  return c.json({ name });
});

app.get("/posts/:id/comment/:comment_id", (c) => {
  const { id, comment_id } = c.req.param();
  return c.json({ id, comment_id });
});

// Optional Parameter
// /api/animal 또는 /api/animal/:type 과 매치한다.
app.get("/api/animal/:type?", (c) => c.text("Animal!"));

// Chained route
app
  .get("/endpoint", (c) => {
    return c.text("GET /endpoint");
  })
  .post((c) => {
    return c.text("POST /endpoint");
  })
  .delete((c) => {
    return c.text("DELETE /endpoint");
  });

serve(app);
