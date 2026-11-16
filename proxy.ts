import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Verificação otimista (apenas presença do cookie de sessão) para evitar
 * renderizar o CMS a visitantes anónimos. A validação real da sessão e do
 * papel de administrador é feita no layout do CMS e em cada server action.
 */
export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  if (pathname.startsWith("/cms") && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  // Áreas privadas nunca devem ser indexadas.
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/cms/:path*", "/login"],
};
