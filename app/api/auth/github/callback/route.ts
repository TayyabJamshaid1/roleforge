import { NextRequest, NextResponse } from "next/server";

import { githubLoginService } from "@/features/auth/auth.service";

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code");

    if (!code) {
      throw new Error("GitHub authorization code missing");
    }

    const result = await githubLoginService(code);

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
