/**
 * <h3>Node.js</h3>
 * @see https://hono.dev/docs/getting-started/nodejs#serve-static-files
 */
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";

const app = new Hono();

// Serve static files
app.use("/static/*", serveStatic({ root: "./src" }));

serve(app);
