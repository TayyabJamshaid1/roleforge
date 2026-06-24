import { NextResponse } from "next/server";

import { loginController } from "@/features/auth/auth.controller";

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

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      {
        status: 400,
      },
    );
  }
}
