import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft02Icon } from "hugeicons-react";
import { ExperienceForm } from "@/components/admin/experience-form";
import { getExperienceById } from "@/app/actions/experiences";

interface EditExperiencePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditExperiencePage({
  params,
}: EditExperiencePageProps) {
  const { id } = await params;
  const { data: experience, success } = await getExperienceById(id);

  if (!success || !experience) {
    notFound();
  }

  const formattedExperience = {
    id: experience.id,
    company: experience.company,
    role: experience.role,
    startDate: experience.startDate,
    endDate: experience.endDate || "",
    description: experience.description || "",
    logoUrl: experience.logoUrl || "",
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/cms/experiences">
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
            Editar Experiência
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Atualiza os dados da tua passagem pela {experience.company}.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <ExperienceForm initialData={formattedExperience} />
      </div>
    </div>
  );
}
