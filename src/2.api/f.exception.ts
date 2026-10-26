/**
 * <h3>HTTPException</h3>
 * 치명적인 오류가 발생하면 Hono(및 많은 생태계 미들웨어)는 HTTPException을 발생시킬 수 있습니다. 이는 오류 응답 반환을 간소화하기 위한 Hono의 사용자 정의 Error입니다.
 * @see https://hono.dev/docs/api/exception
 */
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

// Serve static files
app.use("/static/*", serveStatic({ root: "./src" }));

// 일반적인 Error 객체. status: 500, message는 클라이언트로 전달되지 않는다.
app.get("/error", () => {
  throw new Error("에러");
});

// HTTPException: status와 messsage 설정
app.get("/http-exception", () => {
  throw new HTTPException(401, { message: "인증에 실패했습니다." });
});

serve(app);
