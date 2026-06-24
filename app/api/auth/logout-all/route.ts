import { NextResponse } from "next/server";

import { logoutAllDevicesController } from "@/features/auth/auth.controller";

export async function POST() {
  try {
    const result = await logoutAllDevicesController();

    return NextResponse.json({
      success: true,

      ...result,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,

        message: error.message,
      },

      { status: 401 },
    );
  }
}
