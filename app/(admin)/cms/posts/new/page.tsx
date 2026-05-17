import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft02Icon } from "hugeicons-react";
import { PostForm } from "@/components/admin/post-form";

export default function NewPostPage() {
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
            Criar Novo Artigo
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Escreve o teu conteúdo e configura as informações da publicação.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <PostForm />
      </div>
    </div>
  );
}
