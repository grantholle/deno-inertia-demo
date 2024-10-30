import type { Context } from "@oak/oak/context";
import type { Next } from "@oak/oak/middleware";
import { bold, cyan, green } from "jsr:@std/fmt/colors";

export async function timer(context: Context, next: Next): Promise<void> {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  context.response.headers.set("X-Response-Time", `${ms}ms`);
}

export async function logResponseTime(
  context: Context,
  next: Next,
): Promise<void> {
  await next();
  const rt = context.response.headers.get("X-Response-Time");

  if (rt) {
    console.log(
      `${green(context.request.method)} ${
        cyan(context.request.url.pathname)
      } - ${
        bold(
          String(rt),
        )
      }`,
    );
  }
}
