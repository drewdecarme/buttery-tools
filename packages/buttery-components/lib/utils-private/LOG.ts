import { type ButteryLogLevel, ButteryLogger } from "@buttery/logs";

class ButteryComponentLoggers {
  InputTextDropdown: ButteryLogger;
  UseInputDropdown: ButteryLogger;
  UseDropdownMenu: ButteryLogger;

  constructor(options: { defaultLevel: ButteryLogLevel }) {
    this.InputTextDropdown = new ButteryLogger({
      id: "INPUT_TEXT_DROPDOWN",
      prefix: "InputTextDropdown",
      prefixBgColor: "#c2d600",
      logLevel: options.defaultLevel,
    });
    this.UseInputDropdown = new ButteryLogger({
      id: "USE_INPUT_DROPDOWN",
      prefix: "UseInputDropdown",
      prefixBgColor: "#fd954b",
      logLevel: options.defaultLevel,
    });
    this.UseDropdownMenu = new ButteryLogger({
      id: "USE_DROPDOWN_MENU",
      prefix: "useDropdownMenu",
      prefixBgColor: "#05f7b9",
      logLevel: options.defaultLevel,
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
    (process.env.NODE_ENV === "development" ? "debug" : "error"),
});
