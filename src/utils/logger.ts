/**
 * Logger utility for consistent logging across the application.
 * Debug logs are only shown in development mode.
 */

export const logger = {
  debug: (message: string, ...args: any[]) => {

    if (import.meta.env.DEV) console.log(message, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(message, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(message, ...args);
  },
};