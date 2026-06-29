import { NextResponse } from "next/server";
import { DatabaseConnectionError } from "@/lib/db";

export function successResponse(data: object = {}, status = 200) {
  return NextResponse.json(
    {
      success: true,
      ...data,
    },
    { status }
  );
}

export function errorResponse(error: unknown) {
  if (error instanceof DatabaseConnectionError) {
    return NextResponse.json(
      {
        success: false,
        message: "Database is temporarily unavailable.",
      },
      { status: 503 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: "Something went wrong",
    },
    { status: 500 }
  );
}