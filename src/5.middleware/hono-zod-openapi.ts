/**
 * <h3>Validation and Open API</h3>
 * @see https://hono-zod-openapi.pages.dev/getting-started.html
 */
import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { Hono } from "hono";
import { createOpenApiDocument, openApi } from "hono-zod-openapi";
import { z } from "zod";

const app = new Hono();

app.get(
  "/user",
  openApi({
    tags: ["User"],
    summary: "사용자 조회",
    request: {
      query: z.object({ id: z.coerce.number() }),
    },
    responses: {
      200: z.object({ hi: z.number() }),
    },
  }),
  (c) => {
    const { id } = c.req.valid("query");
    return c.var.res({ hi: id });
  },
);

// Serve the OpenAPI document
createOpenApiDocument(app, {
  info: {
    title: "Example API",
    version: "1.0.0",
  },
});

// Render the OpenAPI document through Swagger UI
app.get("/docs", swaggerUI({ url: "/doc" }));

serve(app);
