// lib/db.ts

import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  throw new Error("Please define MONGODB_URL in .env.local");
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase() {
  try {
    if (!MONGODB_URL) {
      throw new Error("Please define MONGODB_URL");
    }
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URL, {
        maxPoolSize: 10,
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
      });
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error?.message);
    cached.promise = null;
    throw error;
  }
}
