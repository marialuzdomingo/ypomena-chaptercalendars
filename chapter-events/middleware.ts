import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple shared password for the whole site. Any username is accepted —
// only the password matters. To change it, edit the value below and redeploy.
const SITE_PASSWORD = "YPOMENA";

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader?.startsWith("Basic ")) {
    const encoded = authHeader.split(" ")[1];
    const decoded = atob(encoded); // "username:password"
    const password = decoded.split(":")[1];

    if (password === SITE_PASSWORD) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="YPO MENA Chapter Events Registry"',
    },
  });
}

// Protects every route except Next.js's own static/internal assets, so the
// password prompt covers the whole site (both pages, not just one).
export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
