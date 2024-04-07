enum LogLevel {
  DEBUG,
  INFO,
  WARNING,
  ERROR,
  CRITICAL,
}

class Logger {
  private logLevel: LogLevel;

  constructor(logLevel: LogLevel = LogLevel.DEBUG) {
    this.logLevel = logLevel;
  }

  private log(message: string, level: LogLevel): void {
    if (level >= this.logLevel) {
      const levelString = LogLevel[level].toUpperCase();
      let coloredMessage = message;

      switch (level) {
        case LogLevel.DEBUG:
          coloredMessage = `\x1b[34m${message}\x1b[0m`; // Blue
          break;
        case LogLevel.INFO:
          coloredMessage = `\x1b[32m${message}\x1b[0m`; // Green
          break;
        case LogLevel.WARNING:
          coloredMessage = `\x1b[33m${message}\x1b[0m`; // Yellow
          break;
        case LogLevel.ERROR:
          coloredMessage = `\x1b[31m${message}\x1b[0m`; // Red
          break;
        case LogLevel.CRITICAL:
          coloredMessage = `\x1b[41m\x1b[37m${message}\x1b[0m`; // White on Red background
          break;
      }

      console.log(`[${levelString}] ${coloredMessage}`);
    }
  }

  public debug(message: string): void {
    this.log(message, LogLevel.DEBUG);
  }

  public info(message: string): void {
    this.log(message, LogLevel.INFO);
  }

  public warning(message: string): void {
    this.log(message, LogLevel.WARNING);
  }

  public error(message: string): void {
    this.log(message, LogLevel.ERROR);
  }

  public critical(message: string): void {
    this.log(message, LogLevel.CRITICAL);
  }
}

export const logger = new Logger();
