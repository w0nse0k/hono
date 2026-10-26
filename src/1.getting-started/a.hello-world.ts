/**
 * <h3>Hello World</h3>
 * @see https://hono.dev/docs/getting-started/basic#hello-world
 */
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

// Hello World
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

serve(app);
