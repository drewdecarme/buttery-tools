import type { ButteryTokensConfig } from "@buttery/tokens-utils/schemas";
import { generateGUID } from "@buttery/utils/isomorphic";
import type { Updater } from "use-immer";
import { useImmer } from "use-immer";

export type ConfigurationStateResponseBreakpointValue = {
  name: string;
  value: number;
};
type ConfigurationStateResponseBreakpoints = {
  [key: string]: ConfigurationStateResponseBreakpointValue;
};

export type ConfigurationStateResponse = {
  breakpoints: ConfigurationStateResponseBreakpoints;
};

function getInitResponseStateFromConfig(
  config: ButteryTokensConfig
): ConfigurationStateResponse {
  return {
    breakpoints: Object.entries(
      config.response.breakpoints
    ).reduce<ConfigurationStateResponseBreakpoints>(
      (accum, [name, value]) =>
        Object.assign<
          ConfigurationStateResponseBreakpoints,
          ConfigurationStateResponseBreakpoints
        >(accum, {
          [generateGUID()]: {
            name,
            value,
          },
        }),
      {}
    ),
  };
}

export type OnResponseBreakpointAction = (
  options:
    | {
        action: "addBreakpoint";
      }
    | {
        action: "addBreakpointDirection";
        direction: "above" | "below";
        referenceIndex: number;
      }
    | { action: "deleteBreakpoint"; id: string }
    | { action: "updateBreakpoint"; id: string; name: string; value: number }
) => void;

export function useConfigStateResponse(initConfig: ButteryTokensConfig) {
  return useImmer(getInitResponseStateFromConfig(initConfig));
}
export type ConfigurationContextResponseType = {
  response: ConfigurationStateResponse;
  setResponse: Updater<ConfigurationStateResponse>;
};
