import { NextRequest, NextResponse } from "next/server";

import { githubLoginService } from "@/features/auth/auth.service";

export async function GET(request: NextRequest) {
  try {
    const ip =
  request.headers.get("x-forwarded-for")?.split(",")[0] ||
  request.headers.get("x-real-ip") ||
  "unknown";

const userAgent =
  request.headers.get("user-agent") || "unknown";
    const code = request.nextUrl.searchParams.get("code");

    if (!code) {
      throw new Error("GitHub authorization code missing");
    }

  const result = await githubLoginService(code, {
  ip,
  userAgent,
});

    return NextResponse.redirect(
      new URL(
        `/${result.user.role}/dashboard`,

        request.url,
      ),
    );
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url,
      ),
    );
  }
}
