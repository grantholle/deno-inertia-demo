import type { Context } from "@oak/oak/context";
import manifestData from "./build/manifest.json" with { type: "json" };
import type { Request } from "@oak/oak/request";

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
    context.response.body = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Deno + Inertia.js</title>
    <script type="module" src="/${manifestData["src/main.js"].file}"></script>
  </head>
  <body>
    <div id="app" data-page='${JSON.stringify(this.getPageData(context.request))}'></div>
  </body>
</html>`;
  }
}
