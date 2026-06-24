import { connectToDatabase } from "@/lib/db";
import { createSession, deleteAllUserSessions } from "@/lib/session";
import { comparePassword, hashPassword } from "@/lib/password";
import User from "@/models/User";
import { generateResetToken, hashToken } from "@/lib/token";
import { sendEmail } from "@/lib/email";
import { verifyEmailTemplate, welcomeEmailTemplate } from "./auth.email";
import { verifyGoogleToken } from "@/lib/google";
import {
  exchangeGitHubCodeForToken,
  getGitHubPrimaryEmail,
  getGitHubUser,
} from "@/lib/github";
import { rateLimit } from "@/lib/rate-limit";
type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: "user" | "manager";
};

type LoginInput = {
  email: string;
  password: string;
};
async function createAndSendVerificationEmail(user: any) {
  const rawToken = generateResetToken();
  const hashedToken = hashToken(rawToken);
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  // Debugging line
  await user.save();
  const verifyUrl = `${process.env.APP_URL}/verify-email?token=${rawToken}`;

  await sendEmail({
    to: user.email,
    subject: "Verify your RoleForge email",
    html: verifyEmailTemplate(user.name, verifyUrl),
  });
}
export async function registerUserService(data: RegisterInput) {
  await connectToDatabase();

  const existingUser = await User.findOne({ email: data.email });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role,
    authProviders: ["credentials"],
    isEmailVerified: false,
    isActive: true,
  });
  await createAndSendVerificationEmail(user);
  return {
    user: {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    message:
      "Account created successfully. Please check your email to verify your account.",
  };
}

export async function loginUserService(data: LoginInput) {
  const allowed = await rateLimit(
    `login:${data.email}`,
    5,
    600,
  );

  if (!allowed) {
    throw new Error("Too many login attempts. Try again after 10 minutes.");
  }
  await connectToDatabase();

  const user = await User.findOne({ email: data.email }).select("+password"); // Include password for verification

  if (!user || !user.password) {
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    throw new Error("Your account has been disabled");
  }
  if (!user.isEmailVerified) {
    throw new Error("Please verify your email before logging in.");
  }
  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  user.lastLoginAt = new Date();
  await user.save();
  await createSession({
    userId: user._id.toString(),
    sessionVersion: user.sessionVersion,
  });
  return {
    user: {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
    message: "Login successful",
  };
}
export async function forgotPasswordService(email: string) {
  const allowed = await rateLimit(
    `forgot:${email}`,
    3,
    600,
  );

  if (!allowed) {
    throw new Error("Too many password reset requests. Please try later.");
  }
  await connectToDatabase();

  const user = await User.findOne({
    email,
  });

  /**
   * Never reveal whether
   * email exists or not.
   */
  if (!user) {
    return {
      message: "If an account exists, reset instructions have been sent.",
    };
  }

  // Raw token
  const resetToken = generateResetToken();

  // Hash before storing
  const hashedToken = hashToken(resetToken);

  user.passwordResetToken = hashedToken;

  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  await user.save();

  const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,

    subject: "Reset Your Password",

    html: `
      <h2>Reset Password</h2>

      <p>
      Click below to reset your password:
      </p>

      <a href="${resetUrl}">
        Reset Password
      </a>

      <p>
      This link expires in 15 minutes.
      </p>
    `,
  });

  return {
    message: "If an account exists, reset instructions have been sent.",
  };
}
type ResetPasswordInput = {
  token: string;
  password: string;
};

export async function resetPasswordService(data: ResetPasswordInput) {
  await connectToDatabase();

  const hashedToken = hashToken(data.token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: new Date(),
    },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    throw new Error("Invalid or expired reset token");
  }

  const hashedPassword = await hashPassword(data.password);

  user.password = hashedPassword;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  user.sessionVersion += 1;

  await user.save();

  await deleteAllUserSessions(user._id.toString());

  return {
    message: "Password reset successful. Please login again.",
  };
}

type GoogleLoginInput = {
  token: string;
};

export async function googleLoginService(data: GoogleLoginInput) {
  await connectToDatabase();

  const googleUser = await verifyGoogleToken(data.token);

  if (!googleUser.email) {
    throw new Error("Google account email not found");
  }

  if (!googleUser.emailVerified) {
    throw new Error("Google email is not verified");
  }

  let user = await User.findOne({
    email: googleUser.email,
  });

  if (user) {
    if (!user.authProviders.includes("google")) {
      user.authProviders.push("google");
    }

    user.googleId = googleUser.googleId;
    user.isEmailVerified = true;
    user.lastLoginAt = new Date();

    await user.save();
  } else {
    user = await User.create({
      name: googleUser.name || "Google User",
      email: googleUser.email,
      role: "user",
      authProviders: ["google"],
      googleId: googleUser.googleId,
      isEmailVerified: true,
      isActive: true,
      lastLoginAt: new Date(),
    });
  }

  if (!user.isActive) {
    throw new Error("Your account has been disabled");
  }

  await createSession({
    userId: user._id.toString(),
    sessionVersion: user.sessionVersion,
  });

  return {
    message: "Google login successful",
    user: {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
export async function githubLoginService(code: string) {
  await connectToDatabase();

  const accessToken = await exchangeGitHubCodeForToken(code);

  const githubUser = await getGitHubUser(accessToken);

  const email = await getGitHubPrimaryEmail(accessToken);

  let user = await User.findOne({ email });

  if (user) {
    if (!user.authProviders.includes("github")) {
      user.authProviders.push("github");
    }

    user.githubId = githubUser.id.toString();
    user.isEmailVerified = true;
    user.lastLoginAt = new Date();

    await user.save();
  } else {
    user = await User.create({
      name: githubUser.name || githubUser.login,
      email,
      role: "user",
      authProviders: ["github"],
      githubId: githubUser.id.toString(),
      isEmailVerified: true,
      isActive: true,
      lastLoginAt: new Date(),
    });
  }

  if (!user.isActive) {
    throw new Error("Your account has been disabled");
  }

  await createSession({
    userId: user._id.toString(),
    sessionVersion: user.sessionVersion,
  });

  return {
    user: {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}
type VerifyEmailInput = {
  token: string;
};

export async function verifyEmailService(data: VerifyEmailInput) {
  await connectToDatabase();

  const hashedToken = hashToken(data.token);

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: {
      $gt: new Date(),
    },
  }).select("+emailVerificationToken +emailVerificationExpires");
  if (!user) {
    throw new Error("Invalid or expired verification token");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Welcome to RoleForge Auth",
    html: welcomeEmailTemplate(user.name),
  });

  return {
    message: "Email verified successfully. You can now login.",
  };
}

export async function resendVerificationEmailService(email: string) {
  await connectToDatabase();

  const user = await User.findOne({ email });

  if (!user) {
    return {
      message:
        "If an account exists and is not verified, a verification email has been sent.",
    };
  }

  if (user.isEmailVerified) {
    return {
      message: "Your email is already verified.",
    };
  }

  await createAndSendVerificationEmail(user);

  return {
    message:
      "If an account exists and is not verified, a verification email has been sent.",
  };
}
export async function logoutAllDevicesService(userId: string) {
  await connectToDatabase();

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Increase version

  user.sessionVersion += 1;

  await user.save();

  await deleteAllUserSessions(userId);

  return {
    message: "Logged out from all devices",
  };
}
