import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { inertia } from "./inertia.ts";
import { timer, logResponseTime } from "./middleware/timer.ts";
import { staticFiles } from './middleware/static.ts'

const router = new Router();
router.get("/", (ctx) => {
  inertia(ctx, "Index", {
    user: {
      id: 1,
      email: "grant@example.com",
      name: "Grant",
    },
  });
});

router.get("/page", (ctx) => {
  inertia(ctx, "Page", {
    value: "Something",
  });
});

const app = new Application();

// Timer middleware
app.use(logResponseTime);
app.use(timer);

// Serve static files from the build directory
app.use(staticFiles);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: 8080 });
