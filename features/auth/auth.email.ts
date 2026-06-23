export function welcomeEmailTemplate(name: string) {
  return `
    <h2>Welcome to RoleForge Auth</h2>

    <p>Hi ${name},</p>

    <p>Your account has been created successfully.</p>

    <p>You can now login and start using your dashboard.</p>

    <p>Thanks,<br/>RoleForge Team</p>
  `;
}