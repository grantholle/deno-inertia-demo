import type { Context } from "@oak/oak/context";
import type { Next } from "@oak/oak/middleware";
import { blue } from "@std/fmt/colors";

export async function staticFiles(context: Context, next: Next): Promise<void> {
  if (context.request.url.pathname.startsWith("/assets")) {
    console.log(blue(`Serving static file ${context.request.url.pathname}`));
    return await context.send({
      "root": "./build",
    });
  }

  if (context.request.url.pathname.startsWith("/fonts")) {
    console.log(blue(`Serving static file ${context.request.url.pathname}`));
    return await context.send({
      "root": "./",
    });
  }

  await next();
}
