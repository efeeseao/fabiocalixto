import prisma from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function SettingsPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "global" },
  });

  const formattedSettings = settings
    ? {
        heroTitle: settings.heroTitle || "",
        heroDescription: settings.heroDescription || "",
        aboutText: settings.aboutText || "",
        avatarUrl: settings.avatarUrl || "",
        githubUrl: settings.githubUrl || "",
        linkedinUrl: settings.linkedinUrl || "",
        twitterUrl: settings.twitterUrl || "",
      }
    : {};

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Definições do Site
        </h1>
        <p className="text-muted-foreground">
          Gere o conteúdo estático, foto de perfil e as informações principais
          do teu portfólio.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <SettingsForm initialData={formattedSettings} />
      </div>
    </div>
  );
}
