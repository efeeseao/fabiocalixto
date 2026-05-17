import Link from "next/link";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { ArrowRight01Icon } from "hugeicons-react";

export const metadata = {
  title: "Artigos | O Teu Nome",
  description:
    "Os meus pensamentos sobre engenharia de software, design e construção de produtos.",
};

export default async function ArticlesIndexPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl lg:max-w-5xl">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Escrevo sobre software, design e a minha jornada.
        </h1>
        <p className="mt-6 text-base text-muted-foreground leading-relaxed">
          Todos os meus pensamentos, tutoriais e reflexões sobre
          desenvolvimento, carreira e a construção de produtos digitais,
          organizados por ordem cronológica.
        </p>
      </header>

      <div className="mt-16 sm:mt-20">
        <div className="flex flex-col gap-16 border-l border-border/40 pl-6 sm:border-l-0 sm:pl-0">
          {posts.length === 0 ? (
            <p className="text-muted-foreground">
              Ainda não existem artigos publicados.
            </p>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="group relative flex flex-col items-start sm:grid sm:grid-cols-4 sm:items-baseline sm:gap-8"
              >
                <div className="sm:col-span-1 mb-4 sm:mb-0 flex items-center text-sm text-muted-foreground">
                  <span className="absolute -left-6 top-1.5 h-4 w-0.5 rounded-full bg-border sm:hidden" />
                  <time dateTime={post.createdAt.toISOString()}>
                    {format(post.createdAt, "dd 'de' MMMM, yyyy", {
                      locale: pt,
                    })}
                  </time>
                </div>

                <div className="sm:col-span-3 group relative flex flex-col items-start">
                  <h2 className="text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    <Link href={`/artigos/${post.slug}`}>
                      <span className="absolute -inset-y-4 -inset-x-4 sm:-inset-y-6 sm:-inset-x-6 z-0 rounded-2xl bg-muted/0 transition-colors group-hover:bg-muted/40" />
                      <span className="relative z-10">{post.title}</span>
                    </Link>
                  </h2>
                  <p className="relative z-10 mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {post.excerpt || "Sem resumo disponível."}
                  </p>
                  <div className="relative z-10 mt-4 flex items-center text-sm font-medium text-primary">
                    Ler artigo <ArrowRight01Icon className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
