import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is missing");
}

export const bullmqConnection = {
  url: process.env.REDIS_URL,
  maxRetriesPerRequest: null,
};