import { NextResponse } from "next/server";
import { getGitHubAuthUrl } from "@/lib/github";

export async function GET() {
  const url = getGitHubAuthUrl();

  return NextResponse.redirect(url);
}