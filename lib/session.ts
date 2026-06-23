// lib/session.ts

import crypto from "crypto";
import { cookies } from "next/headers";
import { redis } from "@/lib/redis";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME || "roleforge_session";

const SESSION_EXPIRES_IN_SECONDS =
  Number(process.env.SESSION_EXPIRES_IN_SECONDS || 604800);

/**
 * Minimal data stored in Redis.
 */
export type RedisSessionPayload = {
  userId: string;
  sessionVersion: number;
  ip?: string;
  userAgent?: string;
  createdAt: string;
};

/**
 * Final authenticated user.
 * Returned from MongoDB.
 */
export type AuthUser = {
  userId: string;
  name: string;
  email: string;
  role: "user" | "manager" | "admin";
};

function createSessionKey(sessionId: string) {
  return `session:${sessionId}`;
}

function createUserSessionsKey(userId: string) {
  return `user_sessions:${userId}`;
}

/**
 * Creates secure random session ID.
 */
export function generateSessionId() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Create session after:
 * - register
 * - login
 * - google login
 * - github login
 */
export async function createSession(
  payload: Omit<RedisSessionPayload, "createdAt">
) {
  const sessionId = generateSessionId();

  const sessionData: RedisSessionPayload = {
    ...payload,
    createdAt: new Date().toISOString(),
  };

  await redis.set(
    createSessionKey(sessionId),
    JSON.stringify(sessionData),
    "EX",
    SESSION_EXPIRES_IN_SECONDS
  );

  await redis.sadd(
    createUserSessionsKey(payload.userId),
    sessionId
  );

  await redis.expire(
    createUserSessionsKey(payload.userId),
    SESSION_EXPIRES_IN_SECONDS
  );

  const cookieStore = await cookies();

  cookieStore.set(
    SESSION_COOKIE_NAME,
    sessionId,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_EXPIRES_IN_SECONDS,
    }
  );

  return sessionId;
}

/**
 * Get current logged in user.
 *
 * Flow:
 * Cookie
 * ↓
 * Redis
 * ↓
 * MongoDB
 * ↓
 * sessionVersion validation
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();

  const sessionId =
    cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return null;
  }
  
  const sessionData = await redis.get(
    createSessionKey(sessionId)
  );

  if (!sessionData) {
    return null;
  }

  const session =
    JSON.parse(sessionData) as RedisSessionPayload;

  await connectToDatabase();

  const user = await User.findById(
    session.userId
  );

  if (!user) {
    return null;
  }

  /**
   * Security check.
   *
   * If password reset or admin
   * invalidated sessions,
   * sessionVersion will mismatch.
   */
  if (
    user.sessionVersion !==
    session.sessionVersion
  ) {
    return null;
  }

  if (!user.isActive) {
    return null;
  }

  return {
    userId: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

/**
 * Logout current device.
 */
export async function deleteCurrentSession() {
  const cookieStore = await cookies();

  const sessionId =
    cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return;
  }

  const sessionData = await redis.get(
    createSessionKey(sessionId)
  );

  if (sessionData) {
    const session =
      JSON.parse(sessionData) as RedisSessionPayload;

    await redis.srem(
      createUserSessionsKey(session.userId),
      sessionId
    );
  }

  await redis.del(
    createSessionKey(sessionId)
  );

  cookieStore.delete(
    SESSION_COOKIE_NAME
  );
}

/**
 * Logout all devices.
 */
export async function deleteAllUserSessions(
  userId: string
) {
  const sessionIds = await redis.smembers(
    createUserSessionsKey(userId)
  );

  if (sessionIds.length > 0) {
    const keys = sessionIds.map((id) =>
      createSessionKey(id)
    );

    await redis.del(...keys);
  }

  await redis.del(
    createUserSessionsKey(userId)
  );
}

/**
 * Used after:
 * - password reset
 * - password change
 * - suspicious activity
 */
export async function invalidateAllUserSessions(
  userId: string
) {
  await connectToDatabase();

  await User.findByIdAndUpdate(userId, {
    $inc: {
      sessionVersion: 1,
    },
  });

  await deleteAllUserSessions(userId);
}