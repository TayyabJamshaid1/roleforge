import { resetPasswordController } from "@/features/auth/auth.controller";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await resetPasswordController(body);

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error);
  }
}
