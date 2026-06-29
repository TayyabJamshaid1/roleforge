import { loginController } from "@/features/auth/auth.controller";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = request.headers.get("user-agent") || "unknown";

    const result = await loginController({
      ...body,
      ip,
      userAgent,
    });

    return successResponse(result);
  } catch (error: any) {
    return errorResponse(error);
  }
}
