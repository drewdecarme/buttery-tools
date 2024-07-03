const exhaustiveMatchGuard = (_: never): never => {
  throw new Error(`Forgot to include an ${_} in the switch statement`);
};

export type ButteryClientConstructorParams = {
  hostname?: string;
  baseRoute: string;
};
type ButteryClientMethodPostOptions = {
  type: "json";
  body: Record<string, unknown>;
};
//   | { type: "multipart/form-data" };

export class ButteryClient {
  private baseRoute: string;
  private hostname: string;

  constructor({ baseRoute, hostname }: ButteryClientConstructorParams) {
    this.baseRoute = baseRoute;
    this.hostname = hostname ?? "/";
  }

  private getRequestURL(route: string) {
    const hostname = this.hostname ?? "";
    const baseRoute = this.baseRoute;
    const restRoute = route ?? "";
    return `${hostname}${baseRoute}${restRoute}`;
  }

  private async request(
    route: string,
    requestInit: RequestInit
  ): Promise<Response> {
    const url = this.getRequestURL(route);
    console.log({ url });
    return fetch(url, requestInit);
  }

  async get(route: string): Promise<Response> {
    return this.request(route, { method: "GET" });
  }

  async post(
    route: string,
    options: { type: "json"; body: Record<string, unknown> }
    //   | { type: "multipart/form-data"; formData: FormData }
  ): Promise<Response> {
    switch (options.type) {
      case "json":
        return this.request(route, {
          method: "POST",
          body: JSON.stringify(options.body),
          headers: {
            "Content-Type": "application/json",
          },
        });

      default:
        return exhaustiveMatchGuard(options.type);
    }
  }
}

export type ButteryClientBranchOptions = {
  client: ButteryClient;
  route: string;
};

export class ButteryClientBranch {
  private route: string;
  private client: ButteryClient;

  constructor(options: ButteryClientBranchOptions) {
    this.client = options.client;
    this.route = options.route;
  }

  private getFullRoute(route: string) {
    return this.route.concat(route);
  }

  async get<GetResponse>(route?: string) {
    const url = this.getFullRoute(route ?? "");
    try {
      const res = await this.client.get(url);
      const json = await res.json();
      return json as GetResponse;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  async post(route: string, options: ButteryClientMethodPostOptions) {
    const url = this.getFullRoute(route);
    return this.client.post(url, options);
  }
}
