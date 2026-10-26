import type { JWTPayload } from "hono/utils/jwt/types";

interface User {
  id: number;
  name: string;
}

declare module "hono" {
  interface ContextVariableMap {
    username: string;
    message: string;
    jwtPayload: JWTPayload;
    user: User;
  }
}
