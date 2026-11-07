import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "./database/connection-pool.js";
import bookRoutes from "./routes/book-routes.js";
import { createOpenApiDocument } from "hono-zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { Scalar } from "@scalar/hono-api-reference";

const app = new Hono();

app.route("/books", bookRoutes);

serve(app);

createOpenApiDocument(
  app,
  {
    info: {
      title: "Example API",
      version: "1.0.0",
    },
  },
  { routeName: "/doc" },
);

// Render the OpenAPI document through Swagger UI
app.get("/swagger", swaggerUI({ url: "/doc" }));

// Render the OpenAPI document through Scalar
app.get("/scalar", Scalar({ url: "/doc" }));
