import type { Context } from "@oak/oak/context";

export function staticFiles(context: Context): void {
  context.send({
    "root": "./build",
  });
}
