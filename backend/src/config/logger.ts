import env from "./env";

type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private log(level: LogLevel, message: string, meta?: any): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      context: this.context,
      message,
      ...(meta ? { meta } : {}),
      environment: env.NODE_ENV,
    };

    // In production, we might want to use a proper logging service
    if (env.NODE_ENV === "production") {
      // Here we would integrate with a logging service like Winston, Pino, etc.
      console[level](JSON.stringify(logEntry));
    } else {
      // For development and testing, we use console with colors
      const colorize = (text: string, colorCode: number): string =>
        `\x1b[${colorCode}m${text}\x1b[0m`;

      const colorMap: Record<LogLevel, number> = {
        debug: 34, // blue
        info: 32, // green
        warn: 33, // yellow
        error: 31, // red
      };

      console[level](
        `${colorize(timestamp, 90)} [${colorize(level.toUpperCase(), colorMap[level])}] [${colorize(this.context, 36)}]: ${message}`,
        meta ? meta : "",
      );
    }
  }

  debug(message: string, meta?: any): void {
    if (env.NODE_ENV !== "production") {
      this.log("debug", message, meta);
    }
  }

  info(message: string, meta?: any): void {
    this.log("info", message, meta);
  }

  warn(message: string, meta?: any): void {
    this.log("warn", message, meta);
  }

  error(message: string, meta?: any): void {
    this.log("error", message, meta);
  }
}

export default Logger;
