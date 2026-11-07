import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "./database/connection-pool.js";
import bookRoutes from "./routes/book-routes.js";

const app = new Hono();

app.route("book", bookRoutes);

serve(app);
