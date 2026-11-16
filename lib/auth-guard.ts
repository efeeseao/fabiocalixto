import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

/**
 * Lê a sessão atual (memoizada por pedido).
 */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export function isApprovedAdmin(
  user: { role?: string | null; status?: string | null } | null | undefined,
) {
  return user?.role === "ADMIN" && user?.status === "APPROVED";
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Não autorizado.");
    this.name = "UnauthorizedError";
  }
}

/**
 * Garante que o pedido vem de um administrador aprovado.
 * Deve ser chamado no início de TODAS as server actions do CMS,
 * pois as server actions são endpoints públicos acessíveis por POST.
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user || !isApprovedAdmin(session.user)) {
    throw new UnauthorizedError();
  }
  return session;
}
