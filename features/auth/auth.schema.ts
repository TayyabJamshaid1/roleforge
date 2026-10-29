import { z } from "zod";
const passwordSchema = z.string().superRefine((password, ctx) => {
  const requirements = [
    {
      valid: password.length >= 8,
      message: "at least 8 characters",
    },
    {
      valid: /[A-Z]/.test(password),
      message: "one uppercase letter",
    },
    {
      valid: /[a-z]/.test(password),
      message: "one lowercase letter",
    },
    {
      valid: /[0-9]/.test(password),
      message: "one number",
    },
  ];

  const missingRequirements = requirements
    .filter((requirement) => !requirement.valid)
    .map((requirement) => requirement.message);

  if (missingRequirements.length > 0) {
    ctx.addIssue({
      code: "custom",
      message: `Password must contain ${missingRequirements.join(", ")}`,
    });
  }
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  email: z.string().email("Invalid email address").toLowerCase(),

  password: passwordSchema,

  role: z.enum(["user", "manager"]),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
});
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),

  password: passwordSchema,
});
export const googleLoginSchema = z.object({
  token: z.string().min(1, "Google token is required"),
  ip: z.string().optional(),
  userAgent: z.string().optional(),
});
export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export const resendVerificationEmailSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
});
