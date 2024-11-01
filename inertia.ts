import type { Context } from "@oak/oak/context";
import manifestData from "./build/manifest.json" with { type: "json" };
import type { Request } from "@oak/oak/request";
import pick from "just-pick";
import omit from "just-omit";

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
  public version: string = "1";

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
      props: this.getProps(request),
      url: request.url.pathname,
      version: this.version,
    };
  }

  public isPartial(request: Request): boolean {
    return request.headers.get(InertiaHeader.partial_component) ===
      this.component;
  }

  public getProps(request: Request): object {
    const partial = this.isPartial(request);

    const props = {
      ...this.sharedProps,
      ...this.props,
    };

    if (partial && request.headers.get(InertiaHeader.partial_only)) {
      const only = request.headers.get(InertiaHeader.partial_only).split(",");
      return pick(props, only);
    }

    if (partial && request.headers.get(InertiaHeader.partial_except)) {
      const except = request.headers.get(InertiaHeader.partial_except).split(
        ",",
      );
      return omit(props, except);
    }

    return props;
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
    const main = manifestData[entry];
    const build = `${
      main.css.map((path: string) => `<link rel="stylesheet" href="${path}">`)
    }<script type="module" src="/${
      manifestData["src/main.js"].file
    }"></script>`;
    const dev =
      `<script type="module" src="http://localhost:5173/@vite/client"></script><script type="module" src="http://localhost:5173/${entry}"></script>`;

    context.response.body = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Deno + Inertia.js</title>
    ${dev}
  </head>
  <body class="bg-gradient-to-r from-[#9553e9] to-[#6d74ed]">
    <div id="app" data-page='${
      JSON.stringify(this.getPageData(context.request))
    }'></div>
  </body>
</html>`;
  }
}
