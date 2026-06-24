import { NextResponse } from "next/server";

import { verifyEmailController } from "@/features/auth/auth.controller";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await verifyEmailController(body);

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

        message: error.message || "Email verification failed",
      },
      {
        status: 400,
      },
    );
  }
}
