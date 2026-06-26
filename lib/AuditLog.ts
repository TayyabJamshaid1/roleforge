import AuditLog from "@/models/AuditLog";

export async function createAuditLog({
  userId,
  action,
  ip,
  userAgent,
  metadata,
}: {
  userId: string;
  action: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}) {
  await AuditLog.create({
    userId,

    action,

    ip,

    userAgent,

    metadata,
  });
}
export enum AuditAction {
  REGISTER = "REGISTER",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  LOGOUT_ALL_DEVICES = "LOGOUT_ALL_DEVICES",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
  RESET_PASSWORD = "RESET_PASSWORD",
  VERIFY_EMAIL = "VERIFY_EMAIL",
  GOOGLE_LOGIN = "GOOGLE_LOGIN",
  GITHUB_LOGIN = "GITHUB_LOGIN",
}
