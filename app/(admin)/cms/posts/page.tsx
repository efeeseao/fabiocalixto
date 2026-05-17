import Link from "next/link";
import Image from "next/image";
import { getPosts } from "@/app/actions/posts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusSignIcon, DocumentCodeIcon, Image01Icon } from "hugeicons-react";
import { PostActions } from "@/components/admin/post-actions";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export default async function PostsPage() {
  const { data: posts } = await getPosts();

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artigos</h1>
          <p className="text-muted-foreground mt-1">
            Gere os teus artigos do blog. Cria, edita e publica.
          </p>
        </div>
        <Link href="/cms/posts/new">
          <Button className="w-full gap-2 sm:w-auto h-11 sm:h-10">
            <PlusSignIcon className="h-4 w-4" fill="solid" />
            Novo Artigo
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts?.length === 0 ? (
          <Card className="col-span-full flex flex-col items-center justify-center p-12 text-center border-border/40 border-dashed shadow-none bg-muted/10">
            <DocumentCodeIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">Nenhum artigo encontrado</h3>
            <p className="text-muted-foreground mt-1">
              Ainda não escreveste nada. Começa por criar um novo artigo!
            </p>
          </Card>
        ) : (
          posts?.map((post) => (
            <Card
              key={post.id}
              className="group relative flex flex-col p-0 overflow-hidden border-border/40 shadow-sm transition-all hover:shadow-md hover:border-border/80"
            >
              <div className="absolute right-2 top-2 z-10 bg-background/80 backdrop-blur-sm rounded-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <PostActions post={post} />
              </div>

              <div className="relative aspect-video w-full bg-muted/50 border-b border-border/40 overflow-hidden">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground/50">
                    <Image01Icon className="h-8 w-8 mb-2" />
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Sem Capa
                    </span>
                  </div>
                )}

                <div className="absolute left-3 top-3 z-10">
                  {post.published ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-500/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                      Publicado
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-background/90 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border shadow-sm">
                      Rascunho
                    </span>
                  )}
                </div>
              </div>

              <CardContent className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="mb-2 text-xs font-medium text-muted-foreground">
                  {format(new Date(post.createdAt), "dd MMM, yyyy", {
                    locale: pt,
                  })}
                </div>

                <h3 className="mb-2 line-clamp-2 text-lg font-semibold leading-tight">
                  {post.title}
                </h3>

                <p className="line-clamp-3 text-sm text-muted-foreground flex-1">
                  {post.excerpt ||
                    "Sem resumo disponível. Adiciona um resumo para melhor SEO e apresentação."}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
