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
import { ZodError } from "zod";

export async function registerController(body: unknown) {
  try {
    const validatedData = registerSchema.parse(body);

    return await registerUserService(validatedData);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(error.issues.map((issue) => issue.message).join(", "));
    }

    throw error;
  }
}

export async function loginController(body: unknown) {
  try {
    const validatedData = loginSchema.parse(body);

    return await loginUserService(validatedData);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(error.issues.map((issue) => issue.message).join(", "));
    }

    throw error;
  }
}

export async function logoutController() {
  await deleteCurrentSession();

  return {
    message: "Logout successful",
  };
}


export async function resetPasswordController(body: unknown) {
  try {
    const validatedData = resetPasswordSchema.parse(body);

  return await resetPasswordService(validatedData);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(error.issues.map((issue) => issue.message).join(", "));
    }

    throw error;
  }
}

export async function forgotPasswordController(body: unknown) {
  try {
     const validatedData = forgotPasswordSchema.parse(body);

  return await forgotPasswordService(validatedData.email);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(error.issues.map((issue) => issue.message).join(", "));
    }

    throw error;
  }
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