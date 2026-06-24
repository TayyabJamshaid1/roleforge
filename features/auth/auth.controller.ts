import { deleteCurrentSession } from "@/lib/session";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleLoginSchema
} from "./auth.schema";
import {
  loginUserService,
  registerUserService,
  forgotPasswordService,
  resetPasswordService,
  googleLoginService
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