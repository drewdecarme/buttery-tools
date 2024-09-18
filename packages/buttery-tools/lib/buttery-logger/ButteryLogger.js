import chalk from "chalk";
export class ButteryLogger {
    logLevel;
    logLevelValue;
    logLevelColor;
    //   private format: ButteryLoggerOptionFormat;
    prefix;
    logLevelStringMaxLength;
    shouldPrintLevel;
    constructor(options) {
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
        this.logLevelStringMaxLength = Object.keys(this.logLevelColor).reduce((accum, logLevel) => (logLevel.length > accum ? logLevel.length : accum), 0);
    }
    /**
     * Allows to publicly set the logLevel
     * to display the appropriate logs at
     * the appropriate times
     * TODO: This still isn't working
     */
    set level(level) {
        this.logLevel = level;
    }
    printLevel(level) {
        if (!this.shouldPrintLevel)
            return undefined;
        const color = this.logLevelColor[level];
        const levelString = `[${level.toUpperCase()}]`;
        const paddedLevelString = levelString.padEnd(this.logLevelStringMaxLength + 2, " ");
        return color(paddedLevelString);
    }
    printTimestamp() {
        const now = new Date();
        const dateTimeFormat = new Intl.DateTimeFormat("en", {
            timeStyle: "medium"
        });
        const timestampString = chalk.gray(`[${dateTimeFormat.format(now)}]`);
        return timestampString;
    }
    printPrefix() {
        return chalk.bgBlack(`[${this.prefix}]`);
    }
    shouldLog(level) {
        const classNumericLevel = this.logLevelValue[this.logLevel];
        const suppliedNumericLevel = this.logLevelValue[level];
        return classNumericLevel >= suppliedNumericLevel;
    }
    log({ level, message, method }, ...extraSerializableData) {
        if (!this.shouldLog(level))
            return;
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
        console.log(logMessage, ...extraSerializableData.map((data) => this.formatLogData(data)));
    }
    formatLogData(data) {
        if (!data)
            return "";
        return JSON.stringify(data);
    }
    debug(message, ...data) {
        const method = chalk.blue(`● ${chalk.underline("debug")}`);
        this.log({ level: "info", method, message }, ...data);
    }
    success(message, ...data) {
        const method = chalk.green(`✓ ${chalk.underline("success")}`);
        this.log({ level: "info", method, message }, ...data);
    }
    warning(message, ...data) {
        const method = chalk.yellowBright(`! ${chalk.underline("warning")}`);
        this.log({ level: "warn", method, message }, ...data);
    }
    error(message, ...data) {
        const method = chalk.red(`✕ ${chalk.underline("error")}`);
        this.log({ level: "error", method, message }, ...data);
    }
    watch(message, ...data) {
        const method = chalk.hex("#FFA500")(`⦿ ${chalk.underline("watching")}`);
        this.log({ level: "error", method, message }, ...data);
    }
    info(message, ...data) {
        const method = chalk.blueBright(`ℹ︎ ${chalk.underline("info")}`);
        this.log({ level: "info", method, message }, ...data);
    }
    fatal(error) {
        const method = chalk.redBright.bold(`✕ ${chalk.underline("fatal")}`);
        this.log({ level: "error", method, message: error.message });
        if (!this.shouldLog("error"))
            return;
        console.log(`
${chalk.grey(error.stack?.replace(`Error: ${error.message}
`, ""))}    
    `);
    }
}
