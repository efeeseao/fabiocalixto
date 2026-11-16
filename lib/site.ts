export const siteConfig = {
  name: "Fábio Calixto",
  title: "Fábio Calixto | Software Engineer & Creator",
  description:
    "Portfólio e blog de Fábio Calixto. Escrevo sobre engenharia de software, design e construção de produtos.",
  url: (process.env.NEXT_PUBLIC_APP_URL || "https://fabiocalixto.com").replace(
    /\/+$/,
    "",
  ),
  locale: "pt_PT",
  language: "pt-PT",
  twitter: "@efeeseao",
  ogImage: "/og-image.png",
} as const;

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Serializa JSON-LD de forma segura para inserir num <script>. */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
