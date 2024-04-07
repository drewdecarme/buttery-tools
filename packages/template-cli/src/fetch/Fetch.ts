import type { ApiRoutes } from "@machineq/models";

import type {
  QueryParams,
  RequestBody,
  Segments,
  TokenResponse
} from "./fetch.utils.js";
import {
  parseQueryToURLSearchParams,
  parseSegmentsToString,
  readFetchVars,
  writeFetchVars
} from "./fetch.utils.js";

import { logger } from "../utils/util.logger.js";

type FetchParamsGet<Q extends QueryParams> = {
  method: "GET";
  route: ApiRoutes;
  segments?: Segments;
  query?: Q;
};

type FetchParamsPost<
  Q extends QueryParams,
  B extends RequestBody = RequestBody
> = {
  method: "POST";
  route: ApiRoutes;
  segments?: Segments;
  query?: Q;
  body: B;
};

type FetchParams<Q extends QueryParams, B extends RequestBody = RequestBody> =
  | FetchParamsGet<Q>
  | FetchParamsPost<Q, B>;

export class Fetch {
  #token: string | undefined;
  #tokenExpirationTime: number | undefined;

  async #prepareHeaders(): Promise<Headers> {
    try {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");

      const now = new Date();
      const nowTime = now.getTime();

      if (!this.#token || !this.#tokenExpirationTime) {
        const { token, tokenExpirationTime } = await readFetchVars();
        this.#token = token;
        this.#tokenExpirationTime = tokenExpirationTime;
      }

      if (!this.#tokenExpirationTime || this.#tokenExpirationTime < nowTime) {
        logger.debug("Access token doesn't exist or has expired...");
        const body = JSON.stringify({
          grant_type: "client_credentials",
          client_id: process.env.DJANGO_AUTH_0_CLIENT_ID,
          client_secret: process.env.DJANGO_AUTH_0_CLIENT_SECRET,
          audience: process.env.DJANGO_JWT_AUDIENCE
        });

        logger.debug("Getting new access token...");
        const url = new URL("/oauth/token", process.env.DJANGO_JWT_ISSUER);
        const res = await fetch(url, {
          method: "POST",
          headers,
          body,
          redirect: "follow"
        });
        logger.debug("Getting new access token... done.");
        const tokenJson = (await res.json()) as TokenResponse;

        const now = new Date();
        const newToken = tokenJson.access_token;
        this.#tokenExpirationTime = now.setTime(
          now.getTime() + tokenJson.expires_in * 1_000
        );
        this.#token = newToken;
        // save the new values to the file to be read
        // as well as cache them in the class to be used later.
        await writeFetchVars({
          token: this.#token,
          tokenExpirationTime: this.#tokenExpirationTime
        });
      }
      headers.append("Authorization", `Bearer ${this.#token}`);
      return headers;
    } catch (error) {
      logger.error(error as string);
      throw "Error when trying to prepare headers for the fetch request";
    }
  }

  /**
   * Creates a URL from the parameters passed into the request
   * functions.
   */
  #prepareUrl<Q extends QueryParams>(params: FetchParams<Q>): URL {
    const query = parseQueryToURLSearchParams(params.query).toString();
    const segments = parseSegmentsToString(params.segments);
    const url = new URL(
      "/api/v1.0".concat(params.route).concat(segments),
      process.env.PWA_BROWSER_API_HOSTNAME?.concat()
    );
    url.search = query;
    return url;
  }

  async #parseResponse<R>(res: Response): Promise<R> {
    try {
      // const json = await res.text();
      const json = await res.json();
      return json as R;
    } catch (error) {
      throw error;
    }
  }

  async fetch<R = Record<string, unknown>, Q extends QueryParams = QueryParams>(
    params: FetchParams<Q>
  ): Promise<R> {
    try {
      const url = this.#prepareUrl<Q>(params);
      const headers = await this.#prepareHeaders();
      logger.debug(`Fetching... '${params.method}: ${url}'`);
      const res = await fetch(url, {
        method: params.method,
        headers,
        body: params.method === "POST" ? JSON.stringify(params.body) : null
      });

      if (res.status === 404) {
        throw "404 - Not found";
      }
      const json = await this.#parseResponse<R>(res);
      logger.debug(`Fetching... done.`);
      return json;
    } catch (error) {
      logger.error(`Error when trying to ${params.method}`);
      logger.error(error as string);
      throw error;
    }
  }

  async get<R, Q extends QueryParams = Record<string, string>>(
    params: Omit<FetchParamsGet<Q>, "method">
  ) {
    try {
      const json = await this.fetch<R, Q>({
        method: "GET",
        ...params
      });
      return json;
    } catch (error) {
      throw error;
    }
  }

  async post<
    R,
    B extends RequestBody,
    Q extends QueryParams = Record<string, string>
  >(params: Omit<FetchParamsPost<Q, B>, "method">) {
    try {
      const json = await this.fetch<R, Q>({
        method: "POST",
        ...params
      });
      return json;
    } catch (error) {
      throw error;
    }
  }
}
