import chalk, { type ChalkInstance } from "chalk";

export type ButteryLogLevel =
  | "trace"
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "fatal";
type ButteryLoggerOptionFormat = "json" | "basic";

type ButteryLoggerOptions = {
  /**
   * The ID of the logger. This is what the logger will register
   * to in the window if it exists.
   */
  id: string;
  /**
   * The name of the thing that will be logging. This is used
   * to easily identify and name the log
   */
  prefix: string;
  /**
   * - `info` - Displays messages from all loggers
   * - `timer` - Displays messages from `error`, `warn`, `debug`, `timer`
   */
  logLevel?: ButteryLogLevel;
  format?: ButteryLoggerOptionFormat;
  /**
   * A boolean value that determines if the level
   * should be printed along with the message
   * @default false
   */
  shouldPrintLevel?: boolean;
  /**
   * A HEX color of what the bubble should look like when
   * it is being displayed in the browser.
   */
  prefixBgColor: string;
};

export class ButteryLogger {
  private logLevel: ButteryLogLevel;
  //   private format: ButteryLoggerOptionFormat;
  private id: string;
  private prefix: string;
  private logLevelStringMaxLength: number;
  private shouldPrintLevel: boolean;

  private logLevelPriority: { [key in ButteryLogLevel]: number } = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5,
  };

  private logLevelColor: { [key in ButteryLogLevel]: ChalkInstance } = {
    trace: chalk.bold.magenta,
    info: chalk.bold.blue,
    debug: chalk.bold.magenta,
    warn: chalk.bold.yellow,
    error: chalk.bold.red,
    fatal: chalk.bold.redBright,
  };
  isBrowser: boolean;
  prefixBgColor: string;
  private loadingDots: string;
  private loaderInterval: NodeJS.Timeout | null;
  private loadingMessage: string;

  constructor(options: ButteryLoggerOptions) {
    this.id = options.id;
    this.logLevel = options.logLevel ?? "info";
    this.prefix = options.prefix;
    this.prefixBgColor = options.prefixBgColor;

    this.shouldPrintLevel = options.shouldPrintLevel ?? false;
    this.logLevelStringMaxLength = Object.keys(this.logLevelColor).reduce(
      (accum, logLevel) => (logLevel.length > accum ? logLevel.length : accum),
      0
    );
    this.loaderInterval = null;
    this.loadingDots = "";
    this.loadingMessage = "";

    this.isBrowser = typeof window !== "undefined";

    if (this.isBrowser) {
      // @ts-expect-error the window object doesn't have this but that's okay.
      if (typeof window.BUTTERY_LOGS === "undefined") {
        // @ts-expect-error the window object doesn't have this but that's okay.
        window.BUTTERY_LOGS = {};
      }
      // Expose logger to the global window object in the browser
      // @ts-expect-error the window object doesn't have this but that's okay.
      window.BUTTERY_LOGS[this.id] = this;
    }
  }

  getTextColor(prefixBgColor: string) {
    // Convert hex to RGB
    const rgb = Number.parseInt(prefixBgColor.slice(1), 16); // Remove '#' and convert to integer
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;

    // Helper function to convert RGB to relative luminance
    const luminance = (channel: number): number => {
      const iChannel = channel / 255;
      return iChannel <= 0.03928
        ? iChannel / 12.92
        : ((iChannel + 0.055) / 1.055) ** 2.4;
    };

    const l =
      0.2126 * luminance(r) + 0.7152 * luminance(g) + 0.0722 * luminance(b);

    // Determine if white or black text provides better contrast
    return l > 0.179 ? "#000" : "#fff";
  }

  set level(level: ButteryLogLevel) {
    this.logLevel = level;
  }

  private printPrefix(): string[] {
    if (!this.isBrowser) {
      return [chalk.bgBlack(`[${this.prefix}]`)];
    }
    const prefixTextColor = this.getTextColor(this.prefixBgColor);
    const prefixLogCSS = `background-color: ${this.prefixBgColor}; font-weight: bold; font-size:8px; line-height: 16px; padding-right: 4px; padding-left: 8px; border-radius: 8px; border-bottom-left-radius: 8px; color: ${prefixTextColor};`;
    return [`%c${this.prefix}`, prefixLogCSS];
  }

  private printLevel(level: ButteryLogLevel) {
    if (!this.shouldPrintLevel) return undefined;
    const color = this.logLevelColor[level];
    const levelString = `[${level.toUpperCase()}]`;
    const paddedLevelString = levelString.padEnd(
      this.logLevelStringMaxLength + 2,
      " "
    );
    return color(paddedLevelString);
  }

  private printTimestamp() {
    const now = new Date();
    const dateTimeFormat = new Intl.DateTimeFormat("en", {
      timeStyle: "medium",
    });
    const timestampString = chalk.gray(`[${dateTimeFormat.format(now)}]`);

    return timestampString;
  }

  /**
   * Based upon the provided level this function returns a boolean
   * to determine if the request log level priority is greater
   * than the priority of the log level that is set
   */
  private shouldLog(level: ButteryLogLevel) {
    return this.logLevelPriority[level] >= this.logLevelPriority[this.logLevel];
  }

  private getLoggerFn(level: ButteryLogLevel) {
    switch (level) {
      case "error":
      case "fatal":
        return console.error;
      case "warn":
        return console.warn;
      default:
        return console.log;
    }
  }

  private formatNodeLogMessage({
    level,
    message,
    method,
  }: {
    level: ButteryLogLevel;
    message: string;
    method: string;
  }) {
    const msg = chalk.gray(message);
    const timestamp = this.printTimestamp();
    const logLevel = this.printLevel(level);
    const prefix = this.printPrefix();

    return [timestamp, logLevel, prefix[0], method, msg]
      .filter((val) => !!val)
      .join(" ");
  }

  private log(
    {
      level,
      message,
      method,
    }: {
      level: ButteryLogLevel;
      message: string;
      method: string;
    },
    ...extraSerializableData: Record<string, unknown>[]
  ) {
    if (!this.shouldLog(level)) return;

    const logFn = this.getLoggerFn(this.logLevel);

    if (!this.isBrowser) {
      const nodeLogMessage = this.formatNodeLogMessage({
        level,
        message,
        method,
      });
      return logFn(nodeLogMessage);
    }

    const msg = chalk.gray(message);
    const timestamp = this.printTimestamp();
    const prefix = this.printPrefix();

    const levelCss =
      "font-size:8px; line-height: 16px; padding-right: 8px; padding-left: 4px; border-top-right-radius: 8px; border-bottom-right-radius: 8px; font-weight: bold;";

    logFn(
      `${timestamp} ${prefix[0]} %c[${level.toUpperCase()}]`,
      prefix[1],
      levelCss,
      msg,
      extraSerializableData
    );

    // if (extraSerializableData.length === 0) {
    //   return console.log(logMessage);
    // }

    // console.log(
    //   logMessage,
    //   ...extraSerializableData.map((data) => this.formatLogData(data))
    // );
  }

  // private formatLogData(data?: Record<string, unknown>) {
  //   if (!data) return "";
  //   return JSON.stringify(data);
  // }

  public trace(message: string, ...data: Record<string, unknown>[]) {
    const method = chalk.blue(`● ${chalk.underline("trace")}`);
    this.log({ level: "trace", method, message }, ...data);
  }

  public debug(message: string, ...data: Record<string, unknown>[]) {
    const method = chalk.blue(`● ${chalk.underline("debug")}`);
    this.log({ level: "debug", method, message }, ...data);
  }

  public checkpointStart(checkpointName: string) {
    this.checkpoint(checkpointName, "start");
  }

  public checkpointEnd(checkpointName: string) {
    this.checkpoint(checkpointName, "end");
  }

  private checkpoint(checkpointName: string, startOrEnd: "start" | "end") {
    const method = chalk.hex("#FFA500")(
      `${chalk.underline(`● checkpoint: ${checkpointName}:${startOrEnd}`)}`
    );
    this.log({ level: "debug", method, message: "-------" });
  }

  public success(message: string, ...data: Record<string, unknown>[]) {
    const method = chalk.green(`✓ ${chalk.underline("success")}`);
    this.log({ level: "info", method, message }, ...data);
  }

  public warning(message: string, ...data: Record<string, unknown>[]) {
    const method = chalk.yellowBright(`! ${chalk.underline("warning")}`);
    this.log({ level: "warn", method, message }, ...data);
  }

  public error(message: string, ...data: Record<string, unknown>[]) {
    const method = chalk.red(`✕ ${chalk.underline("error")}`);
    this.log({ level: "error", method, message }, ...data);
  }

  public watch(message: string, ...data: Record<string, unknown>[]) {
    const method = chalk.hex("#FFA500")(`⦿ ${chalk.underline("watching")}`);
    this.log({ level: "info", method, message }, ...data);
  }

  public info(message: string, ...data: Record<string, unknown>[]) {
    const method = chalk.blueBright(`ℹ︎ ${chalk.underline("info")}`);
    this.log({ level: "info", method, message }, ...data);
  }

  public table(
    values:
      | (string | number | boolean | null | undefined)[]
      | Record<string, string | number | boolean | null | undefined>,
    level?: ButteryLogLevel
  ) {
    // const method = chalk.blueBright(`ℹ︎ ${chalk.underline("info")}`);
    if (!this.shouldLog(level ?? "info")) return;
    console.table(values);
  }

  private formatLoadingText(dots: string) {
    return chalk.gray(dots);
  }

  private logLoadingMessage(message: string) {
    if (this.logLevelPriority[this.logLevel] >= this.logLevelPriority.info) {
      process.stdout.write(`\r${message}`);
    } else {
      console.log(message);
    }
  }

  public loadingStart(message: string) {
    if (!this.shouldLog("info")) return;

    this.loadingDots = "";

    const method = chalk.magentaBright(`● ${chalk.underline("loading")}`);
    this.loadingMessage = this.formatNodeLogMessage({
      level: "info",
      message,
      method,
    });
    this.logLoadingMessage(`${this.loadingMessage}   `);

    // prevent the interval from running if it's less than the current log level
    if (this.logLevelPriority[this.logLevel] < this.logLevelPriority.info) {
      return;
    }

    this.loaderInterval = setInterval(() => {
      this.loadingDots =
        this.loadingDots.length < 3 ? `${this.loadingDots}.` : "";
      const formattedDots = this.formatLoadingText(
        this.loadingDots.padEnd(3, " ")
      );
      const formattedIntervalMessage = `${this.loadingMessage}${formattedDots}`;
      this.logLoadingMessage(formattedIntervalMessage);
    }, 500);
  }

  public loadingEnd(message: string) {
    if (!this.shouldLog("info")) return;

    // format the message
    const formattedDots = this.formatLoadingText("...");
    const formattedFinalMessage = this.formatLoadingText(message);
    const formattedMessage = `${this.loadingMessage}${formattedDots} ${formattedFinalMessage}`;

    // replace the line
    this.logLoadingMessage(formattedMessage.concat("\n"));

    if (!this.loaderInterval) return;

    // Stop the animation
    clearInterval(this.loaderInterval);
    this.loaderInterval = null;
  }

  public fatal(error: Error) {
    const method = chalk.redBright.bold(`✕ ${chalk.underline("fatal")}`);
    this.log({ level: "fatal", method, message: error.message });
    if (!this.shouldLog("error")) return;
    console.log(`
${chalk.grey(
  error.stack?.replace(
    `Error: ${error.message}
`,
    ""
  )
)}    
    `);
  }
}
