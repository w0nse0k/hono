/**
 * <h3>Context</h3>
 * Context 객체는 각 요청마다 인스턴스화되며, 응답이 반환될 때까지 유지됩니다. 이 객체에 값을 저장하거나, 헤더와 반환할 상태 코드를 설정할 수 있으며, HonoRequest 및 Response 객체에 접근할 수 있습니다.
 * @see https://hono.dev/docs/api/context
 */
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

// req: req는 HonoRequest의 인스턴스입니다.
app.get("/hello", (c) => {
  const userAgent = c.req.header("User-Agent");
  return c.json({ "User-Agent": userAgent });
});

// status(): c.status()을 사용하여 HTTP 상태 코드를 설정할 수 있습니다. 기본값은 200입니다. 코드가 200인 경우에는 c.status()을 사용할 필요가 없습니다.
app.post("/posts", (c) => {
  // Set HTTP status code
  c.status(201);
  return c.text("Your post is created!");
});

// header(): 응답에 대한 HTTP 헤더를 설정할 수 있습니다.
app.get("/", (c) => {
  // Set headers
  c.header("X-Message", "My custom message");
  return c.text("Hello!");
});

// text(): 텍스트를 Content-Type: text/plain 형식으로 렌더링합니다.
app.get("/say", (c) => {
  return c.text("Hello!");
});

// JSON을 Content-Type: application/json 형식으로 렌더링합니다.
app.get("/api", (c) => {
  return c.json({ message: "Hello!" });
});

// html(): HTML을 Content-Type: text/html 형식으로 렌더링합니다.
app.get("/html", (c) => {
  return c.html("<h1>Hello! Hono!</h1>");
});

// notFound(): Not Found 응답을 반환합니다. app.notFound()를 사용하여 이를 사용자 정의할 수 있습니다.
app.get("/notfound", (c) => {
  return c.notFound();
});

// redirect(): 리디렉션, 기본 상태 코드는 302입니다.
app.get("/redirect", (c) => {
  return c.redirect("/");
});
app.get("/redirect-permanently", (c) => {
  return c.redirect("/", 301);
});

// set() / get(): 현재 요청의 수명 기간 동안 임의의 키-값 쌍을 가져오고 설정할 수 있습니다. 이를 통해 미들웨어 간에, 또는 미들웨어에서 라우트 핸들러로 특정 값을 전달할 수 있습니다.
app.use(async (c, next) => {
  c.set("message", "Hono is cool!!");
  await next();
});

app.get("/message", (c) => {
  const message = c.get("message");
  return c.text(`The message is "${message}"`);
});
serve(app);
