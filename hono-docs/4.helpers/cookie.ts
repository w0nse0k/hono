/**
 * <h3>Cookie Helper</h3>
 * cookie options:
 * path: string; // 쿠키가 전송되는 경로 지정. 해당 경로와 그 하위 경로에서 쿠키가 전송됩니다.
 * httpOnly: boolean; // 클라이언트 측 스크립트에서 쿠키에 접근할 수 없도록 설정. XSS(Cross-Site Scripting) 공격 방지에 도움을 줍니다.
 * secure: boolean; // HTTPS를 통해서만 쿠키가 전송되도록 설정. 개발 환경에서는 false로 설정하고, 배포 환경에서는 true로 설정하는 것이 좋습니다.
 * sameSite: "strict" | "lax" | "none"; // 다른 도메인에서 오는 요청(Cross-Site)에 쿠키가 전송되는지를 설정. CSRF(Cross-Site Request Forgery) 공격을 방지합니다.
 * @see https://hono.dev/docs/helpers/cookie
 * @see https://developer.mozilla.org/ko/docs/Web/HTTP/Reference/Headers/Set-Cookie
 */
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

const app = new Hono();

// 쿠키 저장
app.get("/setCookie", (c) => {
  setCookie(c, "username", "Jacob", {
    path: "/",
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 3600, // 1 시간
  });
  return c.json({ message: "쿠키가 설정되었습니다." });
});

// 쿠키 가져오기
app.get("/getCookie", (c) => {
  const yummyCookie = getCookie(c, "username");
  return c.text(yummyCookie ?? "쿠키가 존재하지 않습니다.");
});

// 쿠키 삭제
app.get("/deleteCookie", (c) => {
  deleteCookie(c, "username");
  return c.json({ message: "쿠키가 삭제되었습니다." });
});

serve(app);
