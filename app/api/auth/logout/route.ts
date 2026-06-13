import { NextResponse } from "next/server";
import { logoutController } from "@/features/auth/auth.controller";

export async function POST() {
  try {
    const result = await logoutController();

    return NextResponse.json(
      {
        success: true,
        ...result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 400 }
    );
  }
}