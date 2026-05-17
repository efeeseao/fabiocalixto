import Link from "next/link";
import Image from "next/image";
import { getExperiences } from "@/app/actions/experiences";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusSignIcon, Briefcase02Icon, Building04Icon } from "hugeicons-react";
import { ExperienceActions } from "@/components/admin/experience-actions";

export default async function ExperiencesPage() {
  const { data: experiences } = await getExperiences();

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Experiência</h1>
          <p className="text-muted-foreground mt-1">
            Gere o teu percurso profissional e currículo.
          </p>
        </div>
        <Link href="/cms/experiences/new">
          <Button className="w-full gap-2 sm:w-auto h-11 sm:h-10">
            <PlusSignIcon className="h-4 w-4" fill="solid" />
            Adicionar Experiência
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {experiences?.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center border-border/40 border-dashed shadow-none bg-muted/10">
            <Briefcase02Icon className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">
              Nenhuma experiência adicionada
            </h3>
            <p className="text-muted-foreground mt-1">
              Constrói o teu currículo adicionando os teus empregos e cargos.
            </p>
          </Card>
        ) : (
          experiences?.map((exp) => (
            <Card
              key={exp.id}
              className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-6 transition-colors hover:bg-muted/20 border-border/40 shadow-sm"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-background overflow-hidden">
                {exp.logoUrl ? (
                  <Image
                    src={exp.logoUrl}
                    alt={exp.company}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building04Icon className="h-8 w-8 text-muted-foreground/50" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-bold leading-tight">{exp.role}</h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {exp.company}
                  </span>
                  <span className="hidden h-1 w-1 rounded-full bg-border sm:inline-block"></span>
                  <span>
                    {exp.startDate} — {exp.endDate || "Presente"}
                  </span>
                </div>
              </div>

              <div className="absolute right-4 top-4 sm:relative sm:right-0 sm:top-0">
                <ExperienceActions experience={exp} />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
