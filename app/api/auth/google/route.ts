import { NextResponse } from "next/server";
import { googleLoginController } from "@/features/auth/auth.controller";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = request.headers.get("user-agent") || "unknown";
    const result = await googleLoginController({
      ...body,
      ip,
      userAgent,
    });

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Google login failed",
      },
      { status: 400 },
    );
  }
}
