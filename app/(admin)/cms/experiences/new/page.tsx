import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft02Icon } from "hugeicons-react";
import { ExperienceForm } from "@/components/admin/experience-form";

export default function NewExperiencePage() {
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
            Nova Experiência
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Adiciona uma nova posição ao teu currículo profissional.
          </p>
        </div>
      </div>
      <div className="mt-8">
        <ExperienceForm />
      </div>
    </div>
  );
}
