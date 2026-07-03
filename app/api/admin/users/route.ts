import {
  getAllUsersController,
} from "@/features/auth/auth.controller";

import {
  successResponse,
  errorResponse,
} from "@/lib/api-response";

export async function GET() {
  try {
    const result =
      await getAllUsersController();

    return successResponse(result);
  } catch (error) {
    return errorResponse(error);
  }
}