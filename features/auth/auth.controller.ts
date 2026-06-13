import {
  loginSchema,
  registerSchema,
} from "./auth.schema";

import {
  loginUserService,
  registerUserService,
} from "./auth.service";

export async function registerController(
  body: unknown
) {
  const validatedData =
    registerSchema.parse(body);

  const result =
    await registerUserService(
      validatedData
    );

  return result;
}

export async function loginController(
  body: unknown
) {
  const validatedData =
    loginSchema.parse(body);

  const result =
    await loginUserService(
      validatedData
    );

  return result;
}