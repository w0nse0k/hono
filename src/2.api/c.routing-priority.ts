/**
 * <h3>Routing priority</h3>
 * @see https://hono.dev/docs/api/routing#routing-priority
 */
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono();

// 핸들러나 미들웨어는 등록된 순서대로 실행됩니다.
app.get("/book/a", (c) => c.text("a")); // a
app.get("/book/:slug", (c) => c.text("common")); // common

// 실행하고자 하는 미들웨어가 있다면, 핸들러 위쪽에 코드를 작성하세요.
app.use(logger());
app.get("/foo", (c) => c.text("foo"));

// "fallback" 핸들러를 사용하려면, 다른 핸들러 아래에 코드를 작성하세요.
app.get("/bar", (c) => c.text("bar")); // bar
app.get("*", (c) => c.text("fallback")); // fallback

serve(app);
