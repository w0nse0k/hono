declare module "hono" {
  interface ContextVariableMap {
    message: string;
    user: { id: number; name: string };
  }
}

export {};
