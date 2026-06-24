export function welcomeEmailTemplate(name: string) {
  return `
    <h2>Welcome to RoleForge Auth</h2>

    <p>Hi ${name},</p>

    <p>Your account has been created successfully.</p>

    <p>You can now login and start using your dashboard.</p>

    <p>Thanks,<br/>RoleForge Team</p>
  `;
}

export function verifyEmailTemplate(name: string, verifyUrl: string) {
  return `
    <h2>Verify Your Email</h2>

    <p>Hi ${name},</p>

    <p>Please verify your email address by clicking the link below:</p>

    <a href="${verifyUrl}">
      Verify Email
    </a>

    <p>This link expires in 24 hours.</p>

    <p>If you did not create this account, you can ignore this email.</p>

    <p>Thanks,<br/>RoleForge Team</p>
  `;
}
export function newLoginEmailTemplate({
  name,
  ip,
  userAgent,
}: {
  name: string;
  ip?: string;
  userAgent?: string;
}) {
  return `
    <h2>New Login Detected</h2>

    <p>Hi ${name},</p>

    <p>We noticed a new login to your RoleForge Auth account.</p>

    <p><strong>IP:</strong> ${ip || "Unknown"}</p>

    <p><strong>Device:</strong> ${userAgent || "Unknown"}</p>

    <p>If this was you, no action is needed.</p>

    <p>If this was not you, reset your password immediately and logout from all devices.</p>

    <p>Thanks,<br/>RoleForge Team</p>
  `;
}