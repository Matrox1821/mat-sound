import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export async function proxy(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const hasAdminCookies =
    request.cookies.get("admin")?.value && request.cookies.get("admin_token")?.value;
  const session = await auth.api.getSession({ headers: await headers() });

  if (pathname.startsWith("/admin")) {
    const isSigninPath = pathname === "/admin/signin";

    if (!hasAdminCookies && !isSigninPath) {
      return NextResponse.redirect(new URL("/admin/signin", origin));
    }

    if (hasAdminCookies && isSigninPath) {
      return NextResponse.redirect(new URL("/admin", origin));
    }

    return NextResponse.next();
  }
  const isAuthPath = pathname === "/signin" || pathname === "/signup";
  if (!session && !isAuthPath) {
    const signinUrl = new URL("/signin", origin);
    // Opcional: guardar la url actual para volver después del login
    signinUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signinUrl);
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/user/:path*", "/admin/:path*", "/signin", "/signup"],
};
