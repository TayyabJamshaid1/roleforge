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
  logoutSingleDeviceService
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
  const authUser = await getCurrentUser();

  if (!authUser) {
    throw new Error("Unauthorized");
  }

  return await logoutAllDevicesService(authUser.userId);
}


export async function getMySessionsController() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return await getMySessionsService(user.userId);
}
export async function logoutSingleDeviceController(sessionId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return await logoutSingleDeviceService(user.userId, sessionId);
}