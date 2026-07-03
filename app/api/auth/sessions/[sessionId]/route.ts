import { NextRequest, NextResponse } from "next/server";
import { logoutSingleDeviceController } from "@/features/auth/auth.controller";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  try {
    const { sessionId } = await params;

    const result = await logoutSingleDeviceController(sessionId);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    const message = error.message || "Unable to logout device";

    const status =
      message === "Unauthorized"
        ? 401
        : message.includes("Database")
        ? 503
        : 400;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status }
    );
  }
}