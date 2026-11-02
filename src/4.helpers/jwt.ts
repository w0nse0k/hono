/**
 * <h3>JWT Authentication Helper</h3>
 * @see https://hono.dev/docs/helpers/jwt *
 */
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { jwt, sign, verify } from "hono/jwt";

const app = new Hono();

/**
 * sign(): 이 함수는 페이로드를 인코딩하고, 지정된 알고리즘과 시크릿을 사용하여 서명함으로써 JWT 토큰을 생성합니다.
 * @ses https://hono.dev/docs/helpers/jwt#sign
 */
app.get("/generateToken", async (c) => {
  const payload = {
    sub: "user123",
    role: "admin",
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 시간 후 만료 (초 단위 설정)
  };
  const secret = "mySecretKey"; // 환경설정 파일에서 읽어야 함
  const token = await sign(payload, secret);

  // 예로 token을 httpOnly 쿠키에 저장.
  setCookie(c, "token", token, {
    httpOnly: true,
    maxAge: 3600, // 1 시간 후 만료
  });

  // 토큰을 클라이언트에게 반환합니다.
  return c.json({ token });
});

/**
 * verify(): 이 함수는 JWT 토큰이 진위 여부와 유효 기간이 만료되지 않았는지 확인합니다. 이 함수는 토큰이 변조되지 않았는지 확인하며, 페이로드 유효성 검사를 추가한 경우에만 유효성을 확인합니다.
 * @see https://hono.dev/docs/helpers/jwt#verify
 */
app.get("/verifyToken", async (c) => {
  const token = getCookie(c, "token"); // 쿠키에서 토큰을 가져옵니다.
  const secretKey = "mySecretKey"; // sign() 할 때와 같은 키여야 한다. 환경설정 파일에서 읽어야 함

  if (!token) {
    return c.json({ error: "Token not provided" }, 401);
  }

  try {
    const decodedPayload = await verify(token, secretKey, "HS256");
    return c.json({ decodedPayload });
  } catch (error) {
    return c.json({ error }, 401);
  }
});

/**
 * JWT 인증 미들웨어는 JWT를 통해 토큰을 검증하여 인증 기능을 제공합니다. 이 미들웨어는 cookie 옵션이 설정되지 않은 경우 Authorization 헤더가 있는지 확인합니다.
 * @see https://hono.dev/docs/middleware/builtin/jwt#jwt-auth-middleware
 */
app.use(
  "/auth/*",
  jwt({
    secret: "mySecretKey",
    cookie: "token",
    alg: "HS256",
  }),
);

app.get("/auth/page", (c) => {
  const payload = c.get("jwtPayload");
  return c.json(payload);
});
serve(app);
