// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "next-firebase-auth-edge/lib/next/middleware";
import { authConfig } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/register"
  ) {
    // if already auth'd redirect to dashboard from auth pages
    if (!!request.cookies.get(authConfig.cookieName)) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // if not auth'd, proceed normally
    return NextResponse.next();
  }

  // NOTE: `/api/login` is not used here, and is instead in the dir: /pages/api/login.ts
  //       this is because the next-firebase-auth-edge middleware does not have good error handling, so we make our own
  return authMiddleware(request, {
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    ...authConfig,
    handleValidToken: async (_, headers) => {
      console.log("Successfully authenticated via middleware");
      return NextResponse.next({
        request: {
          headers,
        },
      });
    },
    handleInvalidToken: async () => {
      console.log("Failed authentication via middleware");

      // Avoid redirect loop
      if (request.nextUrl.pathname === "/login") {
        return NextResponse.next();
      }

      // Redirect to /login?redirect=/prev-path when request is unauthenticated
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = `redirect=${request.nextUrl.pathname}${url.search}`;
      return NextResponse.redirect(url);
    },
    handleError: async (error) => {
      console.error("Unhandled authentication error", { error });
      // Avoid redirect loop
      if (request.nextUrl.pathname === "/login") {
        return NextResponse.next();
      }

      // Redirect to /login?redirect=/prev-path on unhandled authentication error
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = `redirect=${request.nextUrl.pathname}${url.search}`;
      return NextResponse.redirect(url);
    },
  });
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/editor/:path*",
    "/api/logout",
    "/login",
    "/register",
  ],
};
