import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME || "roleforge_session";

const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const protectedRoutes = [
  "/user",
  "/manager",
  "/admin",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session =
    request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next|favicon.ico|.*\\..*).*)",
  ],
};