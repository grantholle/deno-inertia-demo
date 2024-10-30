import type { Context } from "@oak/oak/context";
import type { Next } from "@oak/oak/middleware";
import { blue } from "jsr:@std/fmt/colors";

export async function staticFiles(context: Context, next: Next): Promise<void> {
  if (context.request.url.pathname.startsWith("/assets")) {
    console.log(blue(`Serving static file ${context.request.url.pathname}`));
    await context.send({
      "root": "./build",
    });
    return;
  }

  await next();
}
