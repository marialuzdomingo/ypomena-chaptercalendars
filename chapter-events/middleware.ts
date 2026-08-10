import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const AUTH_COOKIE_NAME = "ypomena_auth";
const AUTH_COOKIE_VALUE = "granted";

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get(AUTH_COOKIE_NAME);

  if (cookie?.value === AUTH_COOKIE_VALUE) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

// Protects every route except the login page itself and Next.js's own
// static/internal assets — otherwise redirecting to /login would loop forever.
export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico|login).*)",
};
