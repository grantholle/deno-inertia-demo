import { Application } from "@oak/oak/application";
import { Router } from "@oak/oak/router";
import { InertiaResponseFactory } from "./inertia.ts";
import { logResponseTime, timer } from "./middleware/timer.ts";
import { staticFiles } from "./middleware/static.ts";
import type { Context } from "@oak/oak/context";
import type { Next } from "@oak/oak/middleware";

// Defined routes
const router = new Router();
router.get("/", (context: Context) => {
  context.state.inertia.render(context, "Index");
});

router.get("/page", (context: Context) => {
  context.state.inertia.render(context, "Page", {
    value: crypto.randomUUID(),
  });
});

const app = new Application();

// Timer middleware
app.use(logResponseTime);
app.use(timer);

// Set some Inertia share variables
app.use(async (context: Context, next: Next) => {
  context.state.inertia = new InertiaResponseFactory();
  const user = {
    id: crypto.randomUUID(),
    email: "grant@example.com",
    name: "Grant",
  };

  context.state.inertia.share({
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
