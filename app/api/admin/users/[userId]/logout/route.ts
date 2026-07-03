import {
  forceLogoutUserController,
} from "@/features/auth/auth.controller";

import {
  successResponse,
  errorResponse,
} from "@/lib/api-response";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      userId: string;
    }>;
  }
) {
  try {
    const { userId } = await params;

    const result =
      await forceLogoutUserController(userId);

    return successResponse(result);
  } catch (error) {
    return errorResponse(error);
  }
}