// lib/session.ts

import crypto from "crypto";
import { cookies,headers } from "next/headers";
import { redis } from "@/lib/redis";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { isSuspiciousActivity } from "./secuirity";

const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME || "roleforge_session";

const SESSION_EXPIRES_IN_SECONDS = Number(
  process.env.SESSION_EXPIRES_IN_SECONDS || 604800,
);


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

export type RedisSessionPayload = {
  userId: string;
  sessionVersion: number;
  createdAt?: string;
  // Optional security information
  ip?: string;
  userAgent?: string;
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
  payload: Omit<RedisSessionPayload, "createdAt">,
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
    SESSION_EXPIRES_IN_SECONDS,
  );

  await redis.sadd(createUserSessionsKey(payload.userId), sessionId);

  await redis.expire(
    createUserSessionsKey(payload.userId),
    SESSION_EXPIRES_IN_SECONDS,
  );

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_EXPIRES_IN_SECONDS,
  });

  return sessionId;
}
async function refreshSessionExpiry(userId: string, sessionId: string) {
  const sessionKey = createSessionKey(sessionId);
  const userSessionsKey = createUserSessionsKey(userId);

  await redis.expire(sessionKey, SESSION_EXPIRES_IN_SECONDS);
  await redis.expire(userSessionsKey, SESSION_EXPIRES_IN_SECONDS);

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_EXPIRES_IN_SECONDS,
  });
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
  /**
   * Read cookie from browser.
   *
   * Example:
   * roleforge_session=abc123
   */
  const cookieStore = await cookies();

  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return null;
  }

  /**
   * Get session from Redis.
   *
   * session:abc123
   */
  const sessionData = await redis.get(createSessionKey(sessionId));

  if (!sessionData) {
    return null;
  }

  /**
   * Convert Redis JSON string
   * into object.
   */
  const session = JSON.parse(sessionData) as RedisSessionPayload;

  /**
   * Get current request headers
   * for suspicious activity check.
   */
  const headerStore = await headers();
  const currentUserAgent = headerStore.get("user-agent") || "unknown";

  /**
   * Compare current device
   * with stored device.
   *
   * If suspicious:
   * delete session immediately.
   */
  const suspicious = isSuspiciousActivity({
    currentUserAgent
  });

  if (suspicious) {
    /**
     * Delete Redis session.
     */
    await redis.del(createSessionKey(sessionId));

    /**
     * Remove sessionId from:
     *
     * user_sessions:userId
     */
    await redis.srem(createUserSessionsKey(session.userId), sessionId);

    /**
     * Delete browser cookie.
     */
    cookieStore.delete(SESSION_COOKIE_NAME);

    return null;
  }

  /**
   * Get fresh user
   * from MongoDB.
   */
  await connectToDatabase();

  const user = await User.findById(session.userId);

  if (!user) {
    return null;
  }

  /**
   * Important Security Check
   *
   * If password reset
   * or logout all devices happened,
   * sessionVersion changes.
   *
   * Old sessions become invalid.
   */
  if (user.sessionVersion !== session.sessionVersion) {
    return null;
  }

  /**
   * User account blocked?
   */
  if (!user.isActive) {
    return null;
  }

await refreshSessionExpiry(session.userId, sessionId);

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

  const sessionId = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionId) {
    return;
  }

  const sessionData = await redis.get(createSessionKey(sessionId));

  if (sessionData) {
    const session = JSON.parse(sessionData) as RedisSessionPayload;

    await redis.srem(createUserSessionsKey(session.userId), sessionId);
  }

  await redis.del(createSessionKey(sessionId));

  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Logout all devices.
 */
export async function deleteAllUserSessions(userId: string) {
  const sessionIds = await redis.smembers(createUserSessionsKey(userId));

  if (sessionIds.length > 0) {
    const keys = sessionIds.map((id) => createSessionKey(id));

    await redis.del(...keys);
  }

  await redis.del(createUserSessionsKey(userId));
}

/**
 * Used after:
 * - password reset
 * - password change
 * - suspicious activity
 */
export async function invalidateAllUserSessions(userId: string) {
  await connectToDatabase();

  await User.findByIdAndUpdate(userId, {
    $inc: {
      sessionVersion: 1,
    },
  });

  await deleteAllUserSessions(userId);
}
//This lets a user see active sessions and later logout a single device.
export async function getUserSessions(userId: string) {
  const userSessionsKey = createUserSessionsKey(userId);

  const sessionIds = await redis.smembers(userSessionsKey);

  const sessions = await Promise.all(
    sessionIds.map(async (sessionId) => {
      const sessionData = await redis.get(createSessionKey(sessionId));

      if (!sessionData) return null;

      return {
        sessionId,
        ...JSON.parse(sessionData),
      };
    })
  );

  return sessions.filter(Boolean);
}
export async function deleteSessionById(userId: string, sessionId: string) {
  const sessionKey = createSessionKey(sessionId);
  const userSessionsKey = createUserSessionsKey(userId);

  const sessionData = await redis.get(sessionKey);

  if (!sessionData) {
    await redis.srem(userSessionsKey, sessionId);
    return;
  }

  const session = JSON.parse(sessionData) as RedisSessionPayload;

  if (session.userId !== userId) {
    throw new Error("You cannot delete this session");
  }

  await redis.del(sessionKey);
  await redis.srem(userSessionsKey, sessionId);
}
