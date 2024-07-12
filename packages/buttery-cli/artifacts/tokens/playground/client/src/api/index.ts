import {
  ButteryClient,
  ButteryClientBranch,
  type ButteryClientConstructorParams,
} from "@buttery/client";
import type { ButteryConfigTokens } from "@buttery/core";
import type {
  GetConfigHistoryApiResponse,
  PostConfigApiRequest,
  PostConfigApiResponse,
} from "artifacts/tokens/playground/server";

class ApiClientConfig extends ButteryClientBranch {
  /**
   * Creates a new version of the buttery config
   * to the file system with a timestamp
   */
  async saveConfig(body: PostConfigApiRequest) {
    const res = await this.post<PostConfigApiResponse, PostConfigApiRequest>(
      "",
      {
        type: "json",
        body,
      }
    );
    return res;
  }

  /**
   * Fetches the most recent config from all of the
   * configs in the directory
   */
  async getLatestConfig() {
    const config = await this.get<ButteryConfigTokens>("");
    return config;
  }

  /**
   * Fetches the most recent config from all of the
   * configs in the directory
   */
  async getConfigHistory() {
    const config = await this.get<GetConfigHistoryApiResponse>("/history");
    return config;
  }
}

class ApiClient extends ButteryClient {
  /**
   * A collection of endpoints to fetch and mutate a buttery configuration
   */
  config: ApiClientConfig;

  constructor(options: ButteryClientConstructorParams) {
    super(options);
    const client = new ButteryClient(options);
    this.config = new ApiClientConfig({ route: "/config", client });
  }
}

/**
 * A singleton instance of the ApiClient
 */
export const apiClient = new ApiClient({ baseRoute: "api" });
