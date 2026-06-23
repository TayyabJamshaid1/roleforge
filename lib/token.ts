import crypto from "crypto";

/**
 * Generate secure random token
 */
export function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Hash token before storing
 */
export function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}