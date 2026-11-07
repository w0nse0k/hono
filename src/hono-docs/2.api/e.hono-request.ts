// oxlint-disable no-unused-vars
/**
 * <h3>HonoRequest</h3>
 * @see https://hono.dev/docs/api/request#honorequest
 */
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const app = new Hono();

// param(): 경로 매개변수의 값을 가져옵니다.
// Captured params
app.get("/entry/:id", async (c) => {
  const id = c.req.param("id");
  return c.json({ id });
});

// Get all params at once
app.get("/entry/:id/comment/:commentId", async (c) => {
  const { id, commentId } = c.req.param();
  return c.json({ id, commentId });
});

// query(): 쿼리 문자열 매개변수를 가져옵니다.
// Query params
app.get("/search", async (c) => {
  const query = c.req.query("q");
  return c.json({ q: query });
});

// Get all params at once
app.get("/search-page", async (c) => {
  const { q, limit, offset } = c.req.query();
  return c.json({ q, limit, offset });
});

// queries(): 여러 개의 쿼리 문자열 매개변수 값을 가져옵니다. 예: /searches?tags=A&tags=B
app.get("/searches", async (c) => {
  // tags will be string[]
  const tags = c.req.queries("tags");
  return c.json({ tags });
});

// header(): 요청 헤더 값을 가져옵니다.
app.get("/", (c) => {
  const userAgent = c.req.header("User-Agent");
  return c.text(`Your user agent is ${userAgent}`);
});

// Serve static files
app.use("/static/*", serveStatic({ root: "./src" }));

// parseBody(): multipart/form-data 또는 application/x-www-form-urlencoded 유형의 요청 본문을 파싱합니다.
app.post("/login", async (c) => {
  const { username, password } = await c.req.parseBody();
  // 로그인 처리하고 response를 만든다. (Server Side Rendering)
  return c.html(`
    <html>
    <body>
      <p>${username}님 로그인했습니다.</p>
    </body>
    </html>`);
});

// json(): application/json 유형의 요청 본문을 파싱합니다.
app.post("/signin", async (c) => {
  const { username, password } = await c.req.json();
  return c.json({ username });
});

// path, url, method
app.get("/about/me", async (c) => {
  const pathname = c.req.path; // /about/me
  const url = c.req.url; // http://localhost:3000/about/me
  const method = c.req.method; // GET
  return c.json({ pathname, url, method });
});

serve(app);
