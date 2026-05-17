import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft02Icon } from "hugeicons-react";
import { ProjectForm } from "@/components/admin/project-form";
import { getProjectById } from "@/app/actions/projects";

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;
  const { data: project, success } = await getProjectById(id);

  if (!success || !project) {
    notFound();
  }

  const formattedProject = {
    id: project.id,
    title: project.title,
    description: project.description,
    repositoryUrl: project.repositoryUrl || "",
    liveUrl: project.liveUrl || "",
    imageUrl: project.imageUrl || "",
  };

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
            Editar Projeto
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Atualiza as informações e imagens do teu projeto.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <ProjectForm initialData={formattedProject} />
      </div>
    </div>
  );
}
