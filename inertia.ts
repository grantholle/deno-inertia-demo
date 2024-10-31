import type { Context } from "jsr:@oak/oak/context";
import manifestData from "./build/manifest.json" with { type: "json" };
import type { Request } from "jsr:@oak/oak/request";

export enum InertiaHeader {
  inertia = "x-inertia",
  error_bag = "x-inertia-error-bag",
  location = "x-inertia-location",
  version = "x-inertia-version",
  partial_component = "x-inertia-partial-component",
  partial_only = "x-inertia-partial-data",
  partial_except = "x-inertia-partial-except",
}

export class InertiaResponseFactory {
  protected component: string = "";
  protected props: object = {};
  public sharedProps: object = {};

  public share(props: object): InertiaResponseFactory {
    this.sharedProps = {
      ...this.sharedProps,
      ...props,
    };

    return this;
  }

  public getPageData(request: Request): object {
    return {
      component: this.component,
      props: {
        ...this.sharedProps,
        ...this.props,
      },
      url: request.url.pathname,
      version: "1",
    };
  }

  public render(context: Context, component: string, props: object = {}) {
    this.component = component;
    this.props = props;

    if (context.request.headers.has(InertiaHeader.inertia)) {
      return this.toInertiaResponse(context);
    }

    this.toHtmlResponse(context);
  }

  public toInertiaResponse(context: Context) {
    context.response.headers.append(InertiaHeader.inertia, "true");
    context.response.body = this.getPageData(context.request);
  }

  public toHtmlResponse(context: Context): void {
    const entry = "src/main.js";
    const main = manifestData["src/main.js"]

    context.response.body = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Deno + Inertia.js</title>
    <!-- if development -->
    <script type="module" src="http://localhost:5173/@vite/client"></script>
    <script type="module" src="http://localhost:5173/src/main.js"></script>
  </head>
  <body class="bg-gradient-to-r from-[#9553e9] to-[#6d74ed]">
    <div id="app" data-page='${
      JSON.stringify(this.getPageData(context.request))
    }'></div>
  </body>
</html>`;
  }
}
