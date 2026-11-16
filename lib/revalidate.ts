import "server-only";

import { revalidatePath } from "next/cache";

/** Revalida as páginas públicas que dependem do conteúdo do CMS. */
export function revalidatePublic(...extraPaths: string[]) {
  for (const path of [
    "/",
    "/artigos",
    "/projetos",
    "/sobre",
    "/sitemap.xml",
    "/rss.xml",
    ...extraPaths,
  ]) {
    revalidatePath(path);
  }
}
