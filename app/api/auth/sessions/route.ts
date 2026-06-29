import { getMySessionsController } from "@/features/auth/auth.controller";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function GET() {
  try {
    const result = await getMySessionsController();

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error);
  }
}
