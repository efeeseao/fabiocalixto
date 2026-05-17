import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft02Icon } from "hugeicons-react";
import { PostForm } from "@/components/admin/post-form";
import { getPostById } from "@/app/actions/posts";

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const { data: post, success } = await getPostById(id);

  if (!success || !post) {
    notFound();
  }

  const formattedPost = {
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt || "",
    coverImage: post.coverImage || "",
    published: post.published,
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/cms/posts">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 shrink-0 rounded-full border-border/40"
          >
            <ArrowLeft02Icon className="h-5 w-5 text-muted-foreground" />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Editar Artigo
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Atualiza o conteúdo, capa ou definições de publicação deste artigo.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <PostForm initialData={formattedPost} />
      </div>
    </div>
  );
}
