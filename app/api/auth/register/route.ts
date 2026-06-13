import { NextResponse } from "next/server";

import {
  registerController,
} from "@/features/auth/auth.controller";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const result =
      await registerController(
        body
      );

    return NextResponse.json(
      result,
      {
        status: 201,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "Something went wrong",
      },
      {
        status: 400,
      }
    );
  }
}