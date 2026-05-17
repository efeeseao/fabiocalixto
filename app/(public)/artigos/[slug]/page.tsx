import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { ArrowLeft02Icon, ViewIcon } from "hugeicons-react";
import { ViewTracker } from "@/components/public/view-tracker";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    return { title: "Artigo não encontrado" };
  }

  return {
    title: `${post.title} | O Teu Nome`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const path = `/artigos/${slug}`;

  const [post, viewCount] = await Promise.all([
    prisma.post.findUnique({
      where: { slug, published: true },
    }),
    prisma.pageView.count({
      where: { path },
    }),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl lg:max-w-3xl">
      <ViewTracker path={path} />

      <Link
        href="/"
        className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-md shadow-zinc-800/5 ring-1 ring-border/50 transition-all hover:bg-muted"
        aria-label="Voltar à página inicial"
      >
        <ArrowLeft02Icon className="h-5 w-5 text-muted-foreground transition group-hover:text-foreground" />
      </Link>

      <article>
        <header className="flex flex-col">
          <div className="flex items-center text-base text-muted-foreground">
            <span className="mr-3 h-4 w-0.5 rounded-full bg-border" />
            <time dateTime={post.createdAt.toISOString()}>
              {format(post.createdAt, "dd 'de' MMMM, yyyy", { locale: pt })}
            </time>

            <span className="mx-3 text-border">•</span>
            <span className="flex items-center gap-1.5">
              <ViewIcon className="h-4 w-4" />
              {viewCount} {viewCount === 1 ? "visualização" : "visualizações"}
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {post.coverImage && (
            <div className="mt-8 overflow-hidden rounded-2xl bg-muted/50 border border-border/40">
              <Image
                src={post.coverImage}
                alt={`Capa do artigo: ${post.title}`}
                width={1200}
                height={600}
                className="aspect-video w-full object-cover"
                priority
              />
            </div>
          )}
        </header>

        <div
          className="prose prose-zinc dark:prose-invert prose-lg mt-12 max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl prose-img:border prose-img:border-border/50"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
