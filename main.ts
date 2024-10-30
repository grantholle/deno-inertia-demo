import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { InertiaResponseFactory } from "./inertia.ts";
import { logResponseTime, timer } from "./middleware/timer.ts";
import { staticFiles } from "./middleware/static.ts";
import type { Context } from "@oak/oak/context";
import type { Next } from "@oak/oak/middleware";

const inertia = new InertiaResponseFactory();
const user = {
  id: 1,
  email: "grant@example.com",
  name: "Grant",
};

// Defined routes
const router = new Router();
router.get("/", (context: Context) => {
  inertia.render(context, "Index");
});

router.get("/page", (context: Context) => {
  inertia.render(context, "Page", {
    value: "Something",
  });
});

const app = new Application();

// Timer middleware
app.use(logResponseTime);
app.use(timer);

// Serve static files from the build directory
app.use(async (context: Context, next: Next) => {
  inertia.share({
    user,
  });

  await next();
});

app.use(staticFiles);

// Add the routes for the app
app.use(router.routes());

// Only allow certain methods
app.use(router.allowedMethods());

app.listen({ port: 8080 });
