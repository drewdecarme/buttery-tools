import { exhaustiveMatchGuard } from "@buttery/utils/ts";
import { placeholder } from "./placeholder";

export type DateFormatOptions = {
  format: DateFormat;
  timezone?: "local" | "utc";
};
export type DateFormatTimezone = "local" | "utc";
export type DateFormat =
  | "Thursday, 6/17/20 9:42 AM"
  | "Thursday, 6/17/20"
  | "Thu, 6/17/20 9:42 AM"
  | "6/17/20 9:42 AM"
  | "6/17/20"
  | "9:42 AM"
  | "9:42 AM 6/17/20"
  | "9:42"
  | "9a"
  | "2021_02_21"
  | "6/17"
  | "Jul"
  | "July";

export class Dateify {
  shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  longDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  private isDate(date: Date): boolean {
    return date instanceof Date && !Number.isNaN(date.getTime());
  }

  private getDay(date: Date, options: Required<DateFormatOptions>) {
    switch (options.timezone) {
      case "local":
        return date.getDay();

      case "utc":
        return date.getUTCDay();

      default:
        return exhaustiveMatchGuard(options.timezone);
    }
  }

  private getDate(date: Date, options: Required<DateFormatOptions>) {
    switch (options.timezone) {
      case "local":
        return date.getDate();

      case "utc":
        return date.getUTCDate();

      default:
        return exhaustiveMatchGuard(options.timezone);
    }
  }

  private getMonth(date: Date, options: Required<DateFormatOptions>) {
    switch (options.timezone) {
      case "local":
        return date.getMonth();

      case "utc":
        return date.getUTCMonth();

      default:
        return exhaustiveMatchGuard(options.timezone);
    }
  }

  private getMonthName(date: Date, options: Required<DateFormatOptions>) {
    return this.months[this.getMonth(date, options)];
  }

  private getFullYear(date: Date, options: Required<DateFormatOptions>) {
    switch (options.timezone) {
      case "local":
        return date.getFullYear();

      case "utc":
        return date.getUTCFullYear();

      default:
        return exhaustiveMatchGuard(options.timezone);
    }
  }

  /**
   * M/DD/YY and an abbreviated day of the week
   *
   * @returns
   * `Thursday, 6/17/20`
   */
  private longDate(date: Date, options: Required<DateFormatOptions>): string {
    return `${this.longDays[this.getDay(date, options)]}, ${this.shortDate(
      date,
      options
    )}`;
  }

  /**
   * M/DD/YY
   *
   * @example
   * 6/17/20
   */
  private shortDate(date: Date, options: Required<DateFormatOptions>): string {
    const month = this.getMonth(date, options) + 1;
    const day = this.getDate(date, options);
    const year = this.getFullYear(date, options).toString().substr(2, 4);
    return `${month}/${day}/${year}`;
  }

  /**
   * 12 Hour time with Morning / Evening indicator
   *
   * @returns
   * `9:42 AM`
   */
  private time(date: Date, options: Required<DateFormatOptions>): string {
    const formattedTime = date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: options?.timezone === "utc" ? "utc" : undefined,
    });
    return formattedTime;
  }

  /**
   * M/DD/YY and an abbreviated day of the week
   *
   * @returns
   * `Thu, 6/17/20`
   */
  private date(date: Date, options: Required<DateFormatOptions>): string {
    return `${this.shortDays[this.getDay(date, options)]}, ${this.shortDate(
      date,
      options
    )}`;
  }

  /**
   * Date and Time (no day of the week)
   *
   * @returns
   * `6/17/20 9:42 AM`
   */
  private shortDateAndTime(
    date: Date,
    options: Required<DateFormatOptions>
  ): string {
    return `${this.shortDate(date, options)} ${this.time(date, options)}`;
  }

  /**
   * Day of the week, date, and time
   *
   * @returns
   * `Thu, 6/17/20 9:42 AM`
   */
  private dateAndTime(
    date: Date,
    options: Required<DateFormatOptions>
  ): string {
    return `${this.date(date, options)} ${this.time(date, options)}`;
  }

  /**
   * Day of the week, date, and time
   *
   * @returns
   * `Thursday, 6/17/20 9:42 AM`
   */
  private longDateAndTime(
    date: Date,
    options: Required<DateFormatOptions>
  ): string {
    return `${this.longDate(date, options)} ${this.time(date, options)}`;
  }

  /**
   * Time stamp for downloaded files
   *
   * @returns
   * `2021_02_21`
   */
  private downloadTimeStamp(
    date: Date,
    options: Required<DateFormatOptions>
  ): string {
    const month = this.getMonth(date, options) + 1;
    const day = this.getDate(date, options);
    const year = this.getFullYear(date, options);
    const dayFormatted = day < 10 ? `0${day}` : day;
    const monthFormatted = month < 10 ? `0${month}` : month;
    return `${year}_${monthFormatted}_${dayFormatted}`;
  }

  format(
    dateStringOrDate: string | Date | undefined,
    options: DateFormatOptions
  ) {
    if (typeof dateStringOrDate === "undefined") return placeholder;

    const date = new Date(dateStringOrDate);
    if (!this.isDate(date)) return "Unknown Date";

    const opts: Required<DateFormatOptions> = {
      ...options,
      format: options.format,
      timezone: options.timezone ?? "local",
    };

    switch (options.format) {
      case "Thursday, 6/17/20 9:42 AM":
        return this.longDateAndTime(date, opts);

      case "Thursday, 6/17/20":
        return this.longDate(date, opts);

      case "Thu, 6/17/20 9:42 AM":
        return this.dateAndTime(date, opts);

      case "6/17/20 9:42 AM":
        return this.shortDateAndTime(date, opts);

      case "6/17/20":
        return this.date(date, opts);

      case "9:42 AM":
        return this.time(date, opts);

      case "9:42 AM 6/17/20": {
        const time = this.time(date, opts);
        const formattedDate = this.date(date, opts);
        return `${time} ${formattedDate}`;
      }

      case "2021_02_21":
        return this.downloadTimeStamp(date, opts);

      case "6/17": {
        const month = this.getMonth(date, opts) + 1;
        const dateNum = this.getDate(date, opts);
        return `${month}/${dateNum}`;
      }

      case "Jul": {
        const monthName = this.getMonthName(date, opts);
        return monthName.substring(0, 3);
      }

      case "July": {
        return this.getMonthName(date, opts);
      }

      case "9:42": {
        const time = this.time(date, opts);
        return time.split(" ")[0];
      }

      case "9a": {
        const timeAmPm = this.time(date, opts);
        const time = timeAmPm.split(" ")[0];
        if (time.includes(":00")) {
          const amPM = date.getHours() >= 12 ? "p" : "a";
          return `${time.split(":00")[0]}${amPM}`;
        }
        return time;
      }
      default:
        return exhaustiveMatchGuard(options.format);
    }
  }
}

export const dateify = new Dateify();
