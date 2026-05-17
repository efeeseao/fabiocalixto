import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft02Icon } from "hugeicons-react";
import { ProjectForm } from "@/components/admin/project-form";

export default function NewProjectPage() {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/cms/projects">
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
            Criar Novo Projeto
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Adiciona um novo trabalho ao teu portfólio.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <ProjectForm />
      </div>
    </div>
  );
}
