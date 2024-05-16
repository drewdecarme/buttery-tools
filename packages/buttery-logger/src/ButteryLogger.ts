import chalk, { type ChalkInstance } from "chalk";

type ButteryLoggerOptionLevel = "info" | "timer" | "debug" | "warn" | "error";
type ButteryLoggerOptionFormat = "json" | "basic";

type ButteryLoggerOptions = {
  /**
   * The name of the thing that will be logging. This is used
   * to easily identify and name the log
   */
  prefix: string;
  /**
   * - `info` - Displays messages from all loggers
   * - `timer` - Displays messages from `error`, `warn`, `debug`, `timer`
   */
  logLevel?: ButteryLoggerOptionLevel;
  format?: ButteryLoggerOptionFormat;
  /**
   * A boolean value that determines if the level
   * should be printed along with the message
   * @default false
   */
  shouldPrintLevel?: boolean;
};

export class ButteryLogger {
  private logLevel: ButteryLoggerOptionLevel;
  private logLevelValue: { [key in ButteryLoggerOptionLevel]: number };
  private logLevelColor: { [key in ButteryLoggerOptionLevel]: ChalkInstance };
  //   private format: ButteryLoggerOptionFormat;
  private prefix: string;
  private logLevelStringMaxLength: number;
  private shouldPrintLevel: boolean;

  constructor(options: ButteryLoggerOptions) {
    this.prefix = options.prefix;
    this.logLevel = options.logLevel ?? "info";
    this.logLevelValue = {
      info: 5,
      timer: 4,
      debug: 3,
      warn: 2,
      error: 1
    };
    this.logLevelColor = {
      info: chalk.bold.blue,
      timer: chalk.bold.yellowBright,
      debug: chalk.bold.magenta,
      warn: chalk.bold.yellow,
      error: chalk.bold.red
    };
    this.shouldPrintLevel = options.shouldPrintLevel ?? false;
    this.logLevelStringMaxLength = Object.keys(this.logLevelColor).reduce(
      (accum, logLevel) => (logLevel.length > accum ? logLevel.length : accum),
      0
    );
  }

  private printLevel(level: ButteryLoggerOptionLevel) {
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
      timeStyle: "medium"
    });
    const timestampString = chalk.gray(`[${dateTimeFormat.format(now)}]`);

    return timestampString;
  }

  private printPrefix() {
    return chalk.bgBlack(`[${this.prefix}]`);
  }

  private shouldLog(level: ButteryLoggerOptionLevel) {
    const classNumericLevel = this.logLevelValue[this.logLevel];
    const suppliedNumericLevel = this.logLevelValue[level];

    return classNumericLevel >= suppliedNumericLevel;
  }

  private log(
    {
      level,
      message,
      method
    }: {
      level: ButteryLoggerOptionLevel;
      message: string;
      method: string;
    },
    ...extraSerializableData: Record<string, unknown>[]
  ) {
    if (!this.shouldLog(level)) return;

    const messageString = chalk.gray(message);

    const logMessage = [
      this.printTimestamp(),
      this.printLevel(level),
      this.printPrefix(),
      method,
      messageString
    ]
      .filter((val) => typeof val !== "undefined")
      .join(" ");

    if (level === "error") {
      return console.error(logMessage);
    }

    if (extraSerializableData.length === 0) {
      return console.log(logMessage);
    }

    console.log(
      logMessage,
      ...extraSerializableData.map((data) => this.formatLogData(data))
    );
  }

  private formatLogData(data?: Record<string, unknown>) {
    if (!data) return "";
    return JSON.stringify(data);
  }

  public debug(message: string, ...data: Record<string, unknown>[]) {
    const method = chalk.blue(`● ${chalk.underline("debug")}`);
    this.log({ level: "info", method, message }, ...data);
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
    this.log({ level: "error", method, message }, ...data);
  }

  public info(message: string, ...data: Record<string, unknown>[]) {
    const method = chalk.blueBright(`ℹ︎ ${chalk.underline("info")}`);
    this.log({ level: "info", method, message }, ...data);
  }

  public fatal(error: Error) {
    const method = chalk.redBright.bold(`✕ ${chalk.underline("fatal")}`);
    this.log({ level: "error", method, message: error.message });
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
