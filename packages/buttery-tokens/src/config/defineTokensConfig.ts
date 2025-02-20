import type { ButteryTokensConfig } from "@buttery/tokens-utils/schemas";

type PartialConfig = Partial<Omit<ButteryTokensConfig, "runtime">> &
  Pick<ButteryTokensConfig, "runtime">;

export function defineTokensConfig(params: PartialConfig): PartialConfig {
  return params;
}
