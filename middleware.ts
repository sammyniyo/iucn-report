import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;
  const loginUrl = new URL("/login", request.url);
  const adminDashboard = new URL("/admin", request.url);
  const orgDashboard = new URL("/organization", request.url);

  // 1. Handle public routes (login, API, static files)
  const publicRoutes = ["/login", "/api/auth"];
  if (
    publicRoutes.some(route => pathname.startsWith(route)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // 2. Handle unauthenticated users
  if (!token) {
    loginUrl.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(loginUrl);
  }

  // 3. Prevent authenticated users from accessing login
  if (pathname.startsWith("/login")) {
    return NextResponse.redirect(
      token.role === "admin" ? adminDashboard : orgDashboard
    );
  }

  // 4. Handle role-based routing
  const isAdminRoute = pathname.startsWith("/admin");
  const isOrgRoute = pathname.startsWith("/organization");

  if (isAdminRoute && token.role !== "admin") {
    return NextResponse.redirect(orgDashboard);
  }

  if (isOrgRoute && token.role === "admin") {
    return NextResponse.redirect(adminDashboard);
  }

  // 5. Redirect root path based on role
  if (pathname === "/") {
    return NextResponse.redirect(
      token.role === "admin" ? adminDashboard : orgDashboard
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};