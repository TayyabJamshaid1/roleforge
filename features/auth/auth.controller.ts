import { deleteCurrentSession, getCurrentUser } from "@/lib/session";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleLoginSchema,
  verifyEmailSchema,
  resendVerificationEmailSchema,
} from "./auth.schema";
import {
  loginUserService,
  registerUserService,
  forgotPasswordService,
  resetPasswordService,
  googleLoginService,
  verifyEmailService,
  resendVerificationEmailService,
  logoutAllDevicesService,
  getMySessionsService,
  logoutSingleDeviceService,
  getAllUsersService,
  forceLogoutUserService
} from "./auth.service";

export async function registerController(body: unknown) {
  const validatedData = registerSchema.parse(body);

  const result = await registerUserService(validatedData);

  return result;
}

export async function loginController(body: unknown) {
  const validatedData = loginSchema.parse(body);
  const result = await loginUserService(validatedData);

  return result;
}
export async function logoutController() {
  await deleteCurrentSession();

  return {
    message: "Logout successful",
  };
}

export async function forgotPasswordController(body: unknown) {
  const validatedData = forgotPasswordSchema.parse(body);

  return await forgotPasswordService(validatedData.email);
}

export async function resetPasswordController(body: unknown) {
  const validatedData = resetPasswordSchema.parse(body);

  return await resetPasswordService(validatedData);
}

export async function googleLoginController(body: unknown) {
  const validatedData = googleLoginSchema.parse(body);

  return await googleLoginService(validatedData);
}
export async function verifyEmailController(body: unknown) {
  const validatedData = verifyEmailSchema.parse(body);
  return await verifyEmailService(validatedData);
}

export async function resendVerificationEmailController(body: unknown) {
  const validatedData = resendVerificationEmailSchema.parse(body);

  return await resendVerificationEmailService(validatedData.email);
}
export async function logoutAllDevicesController() {
  const auth = await getCurrentUser();

  if (auth.status !== "authenticated") {
    throw new Error("Unauthorized");
  }

  return await logoutAllDevicesService(auth.user.userId);
}

export async function getMySessionsController() {
  const auth = await getCurrentUser();

  switch (auth.status) {
    case "unauthenticated":
      throw new Error("Unauthorized");

    case "service_unavailable":
      throw new Error("Database is temporarily unavailable");

    case "error":
      throw new Error(auth.message);

    case "authenticated":
      return await getMySessionsService(auth.user.userId);
  }
}
export async function logoutSingleDeviceController(sessionId: string) {
  const auth = await getCurrentUser();

  switch (auth.status) {
    case "unauthenticated":
      throw new Error("Unauthorized");

    case "service_unavailable":
      throw new Error("Database temporarily unavailable");

    case "error":
      throw new Error(auth.message);

    case "authenticated":
      return await logoutSingleDeviceService(
        auth.user.userId,
        sessionId
      );
  }
}
export async function getAllUsersController() {
  const auth = await getCurrentUser();

  if (
    auth.status !== "authenticated" ||
    auth.user.role !== "admin"
  ) {
    throw new Error("Unauthorized");
  }

  const users = await getAllUsersService();

  return {
    users,
  };
}

export async function forceLogoutUserController(
  userId: string
) {
  const auth = await getCurrentUser();

  if (
    auth.status !== "authenticated" ||
    auth.user.role !== "admin"
  ) {
    throw new Error("Unauthorized");
  }

  return await forceLogoutUserService(userId);
}