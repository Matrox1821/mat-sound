import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const admin = request.cookies.get("admin")?.value;
  const admin_token = request.cookies.get("admin_token")?.value;

  if (!admin || !admin_token) {
    if (pathname.startsWith("/admin") && !pathname.endsWith("/login")) {
      const adminLoginUrl = new URL("/admin/login", request.nextUrl.origin);
      return NextResponse.redirect(adminLoginUrl);
    }
  } else {
    if (pathname.endsWith("/admin/login")) {
      const adminUrl = new URL("/admin", request.nextUrl.origin);
      return NextResponse.redirect(adminUrl);
    }
  }
  return NextResponse.next();
}
