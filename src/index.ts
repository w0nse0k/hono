import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "./database/connection-pool.js";
import bookRoutes from "./routes/book-routes.js";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());
app.route("/books", bookRoutes);

app.get("/", (c) => {
  return c.text("Hono Rest API Service");
});

serve(app);
