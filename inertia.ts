import type { Context } from "@oak/oak/context";
import manifestData from "./build/manifest.json" with { type: "json" };

export enum InertiaHeader {
  inertia = "x-inertia",
  error_bag = "x-inertia-error-bag",
  location = "x-inertia-location",
  version = "x-inertia-version",
  partial_component = "x-inertia-partial-component",
  partial_only = "x-inertia-partial-data",
  partial_except = "x-inertia-partial-except",
}

export class InertiaResponse {
  protected component: string;
  protected props: object;
  protected context: Context;
  public sharedProps: object = {};

  constructor(context: Context, component: string, props: object = {}) {
    this.context = context;
    this.component = component;
    this.props = props;
  }

  public share(props: object): InertiaResponse {
    this.sharedProps = {
      ...this.sharedProps,
      ...props,
    }

    return this;
  }

  public getPageData(): object {
    return {
      component: this.component,
      props: {
        ...this.sharedProps,
        ...this.props,
      },
      url: this.context.request.url.pathname,
      version: "1",
    };
  }

  public toResponse() {
    if (this.context.request.headers.has(InertiaHeader.inertia)) {
      return this.toInertiaResponse();
    }

    this.toHtmlResponse();
  }

  public toInertiaResponse() {
    this.context.response.headers.append(InertiaHeader.inertia, "true");
    this.context.response.body = this.getPageData();
  }

  public toHtmlResponse(): void {
    this.context.response.body = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Deno + Inertia.js</title>
    <script type="module" src="/${manifestData["src/main.js"].file}"></script>
  </head>
  <body>
    <div id="app" data-page='${JSON.stringify(this.getPageData())}'></div>
  </body>
</html>`;
  }
}

export function inertia(
  context: Context,
  component: string,
  props: object = {},
) {
  new InertiaResponse(context, component, props).toResponse();
}
