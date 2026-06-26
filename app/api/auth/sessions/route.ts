import { NextResponse } from "next/server";
import { getMySessionsController } from "@/features/auth/auth.controller";

export async function GET() {
  try {
    const result = await getMySessionsController();

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Unable to fetch sessions",
      },
      { status: 401 }
    );
  }
}