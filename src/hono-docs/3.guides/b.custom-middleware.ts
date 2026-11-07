/**
 * <h3>Custom Middleware</h3>
 * @see https://hono.dev/docs/guides/middleware#custom-middleware
 */
import { serve } from "@hono/node-server";
import { Hono, type MiddlewareHandler } from "hono";
import type { H } from "hono/types";

const app = new Hono();

// app.use() 내부에서 직접 사용자 정의 미들웨어를 작성할 수 있습니다
// Custom logger
app.use("/message/*", async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`);
  await next();
});

// Add a custom header
app.use("/message/*", async (c, next) => {
  await next();
  c.header("x-message", "This is middleware!");
});

app.get("/message/hello", (c) => c.text("Hello Middleware!"));

// 미들웨어를 app.use() 내에 직접 포함시키면 재사용성이 제한될 수 있습니다. 따라서 미들웨어를 별도의 함수로 분리할 수 있습니다.
const myLogger: H = async (c, next) => {
  console.log(`myLogger: [${c.req.method}] ${c.req.url}`);
  await next();
};

app.use("/posts/*", myLogger);

app.get("/posts", async (c) => c.text("포스트"));

const authMiddleware: MiddlewareHandler = async (c, next) => {
  c.set("user", { id: 123, name: "Alice" });
  await next();
};

app.use(authMiddleware);

app.get("/", (c) => {
  const user = c.get("user"); // c.var.user
  return c.json({ user });
});

serve(app);
