import { NextResponse, type NextRequest } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

import type { auth } from "@/lib/auth";

type Session = typeof auth.$Infer.Session;

export default async function authMiddleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        //get the cookie from the request
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    // "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/dashboard",
    "/admin",
  ],
};
