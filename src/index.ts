import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "./database/connection-pool.js";
import bookRoutes from "./routes/book-routes.js";
import { logger } from "hono/logger";
import { createOpenApiDocument } from "hono-zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { Scalar } from "@scalar/hono-api-reference";

const app = new Hono();

app.use(logger());
app.route("/books", bookRoutes);

app.get("/", (c) => {
  return c.text("Hono Rest API Service");
});

createOpenApiDocument(
  app,
  {
    info: {
      title: "Bookstore Open API",
      version: "1.0.0",
    },
  },
  { routeName: "/doc" },
);

// Render the OpenAPI document through Swagger UI
app.get("/swagger", swaggerUI({ url: "/doc" }));
app.get("/scalar", Scalar({ url: "/doc" }));
serve(app);
