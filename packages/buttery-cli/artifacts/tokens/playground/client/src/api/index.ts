import {
  ButteryClient,
  ButteryClientBranch,
  type ButteryClientConstructorParams,
} from "@buttery/client";
import type { ButteryConfigTokens } from "@buttery/core";

class ApiClientConfig extends ButteryClientBranch {
  /**
   * Creates a new version of the buttery config
   * to the file system with a timestamp
   */
  async saveConfig(tokensConfig: ButteryConfigTokens) {
    this.post("", { type: "json", body: tokensConfig });
  }

  /**
   * Fetches the most recent config from all of the
   * configs in the directory
   */
  async getLatestConfig() {
    const config = await this.get<ButteryConfigTokens>("");
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
