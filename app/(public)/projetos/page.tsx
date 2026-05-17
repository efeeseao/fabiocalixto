import Image from "next/image";
import prisma from "@/lib/prisma";
import { Link04Icon, GithubIcon, Image01Icon } from "hugeicons-react";

export const metadata = {
  title: "Projetos | O Teu Nome",
  description:
    "Coisas em que trabalhei, desde pequenos testes a produtos reais.",
};

export default async function ProjectsIndexPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-2xl lg:max-w-5xl">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Coisas que construí para tentar colocar a minha marca no universo.
        </h1>
        <p className="mt-6 text-base text-muted-foreground leading-relaxed">
          Trabalhei em vários projetos ao longo dos anos, mas estes são os que
          mais me orgulho. Alguns são open-source, outros são experiências
          pessoais. Sente-te à vontade para explorar o código ou visitar os
          projetos ao vivo.
        </p>
      </header>

      <div className="mt-16 sm:mt-20">
        <ul className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 ? (
            <p className="text-muted-foreground">
              Ainda não existem projetos publicados.
            </p>
          ) : (
            projects.map((project) => (
              <li
                key={project.id}
                className="group relative flex flex-col items-start"
              >
                <div className="relative z-10 flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-muted/50 ring-1 ring-border/50">
                  {project.imageUrl ? (
                    <Image
                      src={project.imageUrl}
                      alt={`Mockup do projeto ${project.title}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <Image01Icon className="h-8 w-8 text-muted-foreground/50" />
                  )}
                </div>

                <h2 className="mt-6 text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  <span className="absolute -inset-y-6 -inset-x-4 z-0 scale-95 bg-muted/0 opacity-0 transition-all group-hover:scale-100 group-hover:bg-muted/40 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl" />

                  <span className="relative z-10">{project.title}</span>
                </h2>

                <div
                  className="relative z-10 mt-2 line-clamp-3 text-sm text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />

                <div className="relative z-10 mt-6 flex flex-wrap items-center gap-4 text-sm font-medium">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors"
                    >
                      <Link04Icon className="h-4 w-4" />
                      <span>Visitar Projeto</span>
                    </a>
                  )}

                  {project.repositoryUrl && (
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <GithubIcon className="h-4 w-4" />
                      <span>Código Fonte</span>
                    </a>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
