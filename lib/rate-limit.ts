import { redis } from "@/lib/redis";

/**
 * Generic Redis Rate Limiter
 *
 * key:
 * Unique identifier for tracking requests.
 *
 * Examples:
 * login:tayyab@gmail.com
 * forgot:tayyab@gmail.com
 * login:tayyab@gmail.com:192.168.1.10
 *
 *
 * limit:
 * Maximum requests allowed in a time window.
 *
 *
 * windowSeconds:
 * How long this key should live in Redis.
 *
 * Example:
 * 600 = 10 minutes
 */

export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
) {

  /**
   * Redis INCR
   *
   * If key does not exist:
   *
   * login:tayyab@gmail.com
   *
   * Redis creates:
   *
   * login:tayyab@gmail.com = 1
   *
   * Next request:
   *
   * login:tayyab@gmail.com = 2
   *
   * Next request:
   *
   * login:tayyab@gmail.com = 3
   */
  const count = await redis.incr(key);



  /**
   * Expiry should be added only once.
   *
   * Suppose:
   *
   * login:tayyab@gmail.com = 1
   *
   * Then:
   *
   * Expire after 600 seconds
   *
   * Redis automatically deletes
   * this key after 10 minutes.
   */
  if (count === 1) {

    await redis.expire(
      key,
      windowSeconds
    );

  }



  /**
   * Check whether user is within allowed limit.
   *
   * Example:
   *
   * limit = 5
   *
   * count = 1 -> true
   * count = 2 -> true
   * count = 3 -> true
   * count = 4 -> true
   * count = 5 -> true
   * count = 6 -> false
   *
   * Once false is returned,
   * login or forgot password
   * request should be blocked.
   */
  return count <= limit;
}