/// <reference types="vite/client" />

/**
 * Type definitions for Vite environment variables
 * Extend this interface to add custom environment variables
 */
interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly SSR: boolean;
  // Add custom env variables here, e.g.:
  // readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
