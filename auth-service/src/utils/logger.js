// this implements a logging feature

// This code sets up a logging utility using the Winston library, a popular logging framework for Node.js. The file creates a logger instance that logs messages to the console and two files (error.log and combined.log) with different configurations based on the environment (e.g., production or development). The logger is designed for an "identity-service" and supports structured logging with timestamps, error stacks, and JSON formatting.

import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
//   Adjusts verbosity (info vs. debug) based on the environment, ensuring detailed logs during development and concise logs in production

// Winston’s log levels (in increasing severity): silly, debug, verbose, info, warn, error.
// This ensures detailed logging during development but reduces noise in production.
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "identity-service" },
  //   this is meta data
//   Specifies where logs are sent using Winston’s transports. A transport is a destination for log messages
  transports: [
    new winston.transports.Console({//it means we want all our logs in the console
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    // Logs messages to a file named error.log.
    new winston.transports.File({ filename: "combined.log" }),
    // Logs messages to a file named combined.log.
  ],
});

export default logger;
// Exports the configured logger instance for use in other parts of the application.