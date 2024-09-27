import { type ButteryLogLevel, ButteryLogger } from "../../buttery-logger";

class ButteryComponentLoggers {
  InputTextDropdown: ButteryLogger;

  constructor(options: { defaultLevel: ButteryLogLevel }) {
    this.InputTextDropdown = new ButteryLogger({
      id: "INPUT_TEXT_DROPDOWN",
      prefix: "InputTextDropdown",
      prefixBgColor: "#c2d600",
      logLevel: options.defaultLevel
    });

    if (typeof window !== "undefined") {
      // Expose logger to the global window object in the browser
      // @ts-expect-error the window object doesn't have this but that's okay.
      window.BUTTERY_COMPONENT_LOGS = this;
    }
  }
}

const butteryLogLevel =
  typeof window !== "undefined"
    ? undefined
    : (process.env.BUTTERY_LOG_LEVEL as ButteryLogLevel | undefined);

export const LOG = new ButteryComponentLoggers({
  defaultLevel:
    butteryLogLevel ??
    (process.env.NODE_ENV === "development" ? "debug" : "error")
});
