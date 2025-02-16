import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { AppError } from "./error.middleware";
import Logger from "../config/logger";

const logger = new Logger("ValidationMiddleware");

/**
 * Factory function that creates middleware to validate request data against a Zod schema
 */
export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse and validate request data with Zod schema
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        }));

        logger.debug("Validation error", formattedErrors);

        return res.status(400).json({
          error: "Validation Error",
          message: "Invalid request data",
          details: formattedErrors,
        });
      }

      return next(error);
    }
  };
};

/**
 * Rate limiting middleware factory
 * Creates middleware that limits requests based on IP address
 */
export const makeRateLimiter = (windowMs: number, maxRequests: number) => {
  const requests = new Map<string, { count: number; startTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || "unknown";
    const now = Date.now();

    // Clean up expired records
    for (const [key, data] of requests.entries()) {
      if (now - data.startTime > windowMs) {
        requests.delete(key);
      }
    }

    // Check and update rate limit for this IP
    if (!requests.has(ip)) {
      requests.set(ip, { count: 1, startTime: now });
    } else {
      const data = requests.get(ip)!;

      // Reset if window has passed
      if (now - data.startTime > windowMs) {
        data.count = 1;
        data.startTime = now;
      } else if (data.count >= maxRequests) {
        // Rate limit exceeded
        return res.status(429).json({
          error: "Too Many Requests",
          message: "Too many requests, please try again later",
          retryAfter: Math.ceil((data.startTime + windowMs - now) / 1000),
        });
      } else {
        // Increment count
        data.count += 1;
      }
    }

    next();
  };
};
