import { logoutController } from "@/features/auth/auth.controller";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function POST() {
  try {
    const result = await logoutController();

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error);
  }
}
