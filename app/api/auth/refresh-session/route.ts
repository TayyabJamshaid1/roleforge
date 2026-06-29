import { NextResponse } from "next/server";
import { refreshCurrentSession } from "@/lib/session";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function POST() {
  try {
    const result = await refreshCurrentSession();

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
