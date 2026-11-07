/**
 * <h3>Middleware</h3>
 * @see https://hono.dev/docs/guides/middleware
 * 핸들러 - Response 객체를 반환해야 합니다. 핸들러는 단 하나만 호출됩니다.
미들웨어 - 다음 미들웨어를 호출하려면 await next()을 호출하고 아무것도 반환하지 않지만, 조기 종료하기 위해 Response를 반환할 수 있다.
 */
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";

const app = new Hono();
// 모든 method와 routes에 매치한다.
// logger(): Built-in Middleware
app.use(logger());

// 핸들러가 Response를 반환하면, 해당 응답이 최종 사용자에게 제공되며 처리가 중단됩니다.
app.get("/posts", (c) => {
  console.log("포스트 목록 핸들러");
  return c.text("포스트 목록");
});

// Execution order: 미들웨어의 실행 순서는 등록된 순서에 따라 결정됩니다. 가장 먼저 등록된 미들웨어의 next 이전의 프로세스가 먼저 실행되고, next 이후의 프로세스는 마지막에 실행됩니다. 아래를 참조하십시오.
app.use(async (_, next) => {
  console.log("middleware 1 start");
  await next();
  console.log("middleware 1 end");
});
app.use(async (_, next) => {
  console.log("middleware 2 start");
  await next();
  console.log("middleware 2 end");
});
app.use(async (_, next) => {
  console.log("middleware 3 start");
  await next();
  console.log("middleware 3 end");
});

app.get("/", (c) => {
  console.log("handler");
  return c.text("Hello!");
});

serve(app);
