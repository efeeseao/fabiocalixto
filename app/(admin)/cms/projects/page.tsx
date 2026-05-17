import Link from "next/link";
import Image from "next/image";
import { getProjects } from "@/app/actions/projects";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PlusSignIcon,
  Briefcase02Icon,
  Image01Icon,
  GithubIcon,
  Link04Icon,
} from "hugeicons-react";
import { ProjectActions } from "@/components/admin/project-actions";

export default async function ProjectsPage() {
  const { data: projects } = await getProjects();

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground mt-1">
            Gere o teu portfólio de projetos e trabalhos.
          </p>
        </div>
        <Link href="/cms/projects/new">
          <Button className="w-full gap-2 sm:w-auto h-11 sm:h-10">
            <PlusSignIcon className="h-4 w-4" fill="solid" />
            Novo Projeto
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects?.length === 0 ? (
          <Card className="col-span-full flex flex-col items-center justify-center p-12 text-center border-border/40 border-dashed shadow-none bg-muted/10">
            <Briefcase02Icon className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">Nenhum projeto encontrado</h3>
            <p className="text-muted-foreground mt-1">
              Ainda não adicionaste nada ao portfólio.
            </p>
          </Card>
        ) : (
          projects?.map((project) => (
            <Card
              key={project.id}
              className="group relative flex flex-col overflow-hidden border-border/40 shadow-sm transition-all hover:shadow-md hover:border-border/80 p-0"
            >
              <div className="absolute right-2 top-2 z-10 bg-background/80 backdrop-blur-sm rounded-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <ProjectActions project={project} />
              </div>

              <div className="relative aspect-video w-full bg-muted/50 border-b border-border/40 overflow-hidden">
                {project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground/50">
                    <Image01Icon className="h-8 w-8 mb-2" />
                    <span className="text-xs font-medium uppercase tracking-wider">
                      Sem Imagem
                    </span>
                  </div>
                )}
              </div>

              <CardContent className="flex flex-1 flex-col p-4 sm:p-5">
                <h3 className="mb-2 line-clamp-1 text-lg font-semibold leading-tight">
                  {project.title}
                </h3>

                <div
                  className="line-clamp-2 text-sm text-muted-foreground flex-1 mb-4"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />

                <div className="flex items-center gap-3 mt-auto">
                  {project.repositoryUrl && (
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Código Fonte"
                    >
                      <GithubIcon className="h-5 w-5" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      title="Ver Site"
                    >
                      <Link04Icon className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
