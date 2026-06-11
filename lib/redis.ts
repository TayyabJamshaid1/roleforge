import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  throw new Error("REDIS_URL is missing");
}

declare global {
  var redisClient: Redis | undefined;
}

export const redis =
  global.redisClient ||
  new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
  });

if (process.env.NODE_ENV !== "production") {
  global.redisClient = redis;
}