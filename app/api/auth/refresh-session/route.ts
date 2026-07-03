import { NextResponse } from "next/server";
import { refreshSessionExpiry } from "@/lib/session";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function POST() {
  try {
    const result = await refreshSessionExpiry();

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: "No active session",
        },
        { status: 401 },
      );
    }

    return successResponse({});
  } catch (error: any) {
    return errorResponse(error);
  }
}
