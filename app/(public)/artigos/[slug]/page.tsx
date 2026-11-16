import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { ArrowLeft02Icon, ViewIcon } from "hugeicons-react";
import type { Metadata } from "next";
import { ViewTracker } from "@/components/public/view-tracker";
import { getPublishedPostBySlug } from "@/lib/data";
import { sanitizeRichText, stripHtml, truncate } from "@/lib/sanitize";
import { absoluteUrl, jsonLd, siteConfig } from "@/lib/site";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return { title: "Artigo não encontrado", robots: { index: false } };
  }

  const description = truncate(
    post.excerpt || stripHtml(post.content) || siteConfig.description,
  );
  const url = `/artigos/${post.slug}`;
  const images = post.coverImage
    ? [{ url: post.coverImage, alt: post.title }]
    : [{ url: siteConfig.ogImage, width: 1200, height: 630 }];

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [siteConfig.url],
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      creator: siteConfig.twitter,
      images: images.map((i) => i.url),
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const path = `/artigos/${slug}`;

  const [post, viewCount] = await Promise.all([
    getPublishedPostBySlug(slug),
    prisma.pageView.count({
      where: { path },
    }),
  ]);

  if (!post) {
    notFound();
  }

  const url = absoluteUrl(path);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: truncate(post.excerpt || stripHtml(post.content)),
    image: post.coverImage
      ? [absoluteUrl(post.coverImage)]
      : [absoluteUrl(siteConfig.ogImage)],
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    inLanguage: siteConfig.language,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      "@id": `${siteConfig.url}/#person`,
      name: siteConfig.name,
    },
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Artigos",
        item: absoluteUrl("/artigos"),
      },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <div className="mx-auto max-w-2xl lg:max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs) }}
      />
      <ViewTracker path={path} />

      <Link
        href="/artigos"
        className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-md shadow-zinc-800/5 ring-1 ring-border/50 transition-all hover:bg-muted"
        aria-label="Voltar aos artigos"
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
          dangerouslySetInnerHTML={{ __html: sanitizeRichText(post.content) }}
        />
      </article>
    </div>
  );
}
