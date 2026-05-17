import { betterFetch } from "@better-fetch/fetch";
import { NextResponse, type NextRequest } from "next/server";

type SessionResponse = {
  session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string | null;
    role: "USER" | "ADMIN";
    status: "PENDING" | "APPROVED" | "REJECTED";
  };
};

export default async function proxy(request: NextRequest) {
  const { data } = await betterFetch<SessionResponse>("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute) {
    if (!data || !data.user) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const isApprovedAdmin =
      data.user.role === "ADMIN" && data.user.status === "APPROVED";

    if (!isApprovedAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
