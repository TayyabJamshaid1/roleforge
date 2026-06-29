import { logoutAllDevicesController } from "@/features/auth/auth.controller";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function POST() {
  try {
    const result = await logoutAllDevicesController();

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error);
  }
}
