import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  GithubIcon,
  Linkedin01Icon,
  TwitterIcon,
  Briefcase02Icon,
  Mail01Icon,
  ArrowRight01Icon,
} from "hugeicons-react";
import { NewsletterForm } from "@/components/public/newsletter-form";

export default async function HomePage() {
  const [settings, posts, experiences] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "global" } }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.workExperience.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <div className="space-y-24">
      <section className="max-w-2xl">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 p-0.5 shadow-sm ring-1 ring-border/50">
          <div className="relative h-full w-full overflow-hidden rounded-full bg-primary/20">
            {settings?.avatarUrl && (
              <Image
                src={settings.avatarUrl}
                alt="Avatar"
                fill
                priority
                sizes="64px"
                className="object-cover"
              />
            )}
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {settings?.heroTitle || "Software Engineer & Creator"}
        </h1>

        <p className="mt-6 text-base text-muted-foreground leading-relaxed">
          {settings?.heroDescription || "Uma breve introdução sobre ti..."}
        </p>

        <div className="mt-6 flex gap-4">
          {settings?.githubUrl && (
            <a
              href={settings.githubUrl}
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <GithubIcon className="h-6 w-6" />
            </a>
          )}
          {settings?.linkedinUrl && (
            <a
              href={settings.linkedinUrl}
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin01Icon className="h-6 w-6" />
            </a>
          )}
          {settings?.twitterUrl && (
            <a
              href={settings.twitterUrl}
              target="_blank"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <TwitterIcon className="h-6 w-6" />
            </a>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
        <div className="flex flex-col gap-10">
          <h2 className="text-2xl font-bold tracking-tight">Últimos Artigos</h2>
          <div className="flex flex-col gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group relative flex flex-col items-start justify-between"
              >
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <time
                    dateTime={post.createdAt.toISOString()}
                    className="border-l-2 border-primary/50 pl-3"
                  >
                    {format(post.createdAt, "dd 'de' MMMM, yyyy", {
                      locale: pt,
                    })}
                  </time>
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                  <Link href={`/artigos/${post.slug}`}>
                    <span className="absolute inset-0" />
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {post.excerpt || "Sem resumo."}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-primary">
                  Ler artigo <ArrowRight01Icon className="ml-1 h-4 w-4" />
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-10">
          <div className="rounded-2xl border border-border/40 bg-card p-6 shadow-sm">
            <h2 className="flex items-center text-sm font-semibold text-foreground">
              <Mail01Icon className="h-5 w-5 mr-3 text-muted-foreground" />
              Subscreve à Newsletter
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Recebe atualizações sobre os meus projetos e novos artigos
              diretamente no teu email. Sem spam.
            </p>

            <NewsletterForm />
          </div>

          <div className="rounded-2xl border border-border/40 bg-card p-6 shadow-sm">
            <h2 className="flex items-center text-sm font-semibold text-foreground">
              <Briefcase02Icon className="h-5 w-5 mr-3 text-muted-foreground" />
              Experiência Profissional
            </h2>
            <ol className="mt-6 space-y-6 text-sm text-muted-foreground">
              {experiences.map((exp) => (
                <li key={exp.id} className="flex gap-4">
                  <div className="relative mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full shadow-md shadow-zinc-800/5 ring-1 ring-border/50 bg-background">
                    {exp.logoUrl ? (
                      <Image
                        src={exp.logoUrl}
                        alt={exp.company}
                        className="h-7 w-7 rounded-full object-cover"
                        width={28}
                        height={28}
                      />
                    ) : (
                      <Briefcase02Icon className="h-5 w-5 text-muted-foreground/50" />
                    )}
                  </div>
                  <dl className="flex flex-auto flex-wrap gap-x-2">
                    <dt className="sr-only">Empresa</dt>
                    <dd className="w-full flex-none text-sm font-medium text-foreground">
                      {exp.company}
                    </dd>
                    <dt className="sr-only">Cargo</dt>
                    <dd className="text-xs text-muted-foreground">
                      {exp.role}
                    </dd>
                    <dt className="sr-only">Data</dt>
                    <dd
                      className="ml-auto text-xs text-muted-foreground/80"
                      aria-label={`${exp.startDate} até ${exp.endDate || "Presente"}`}
                    >
                      {exp.startDate} <span aria-hidden="true">—</span>{" "}
                      {exp.endDate || "Atual"}
                    </dd>
                  </dl>
                </li>
              ))}
            </ol>
            {settings?.resumeUrl && (
              <a
                href={settings.resumeUrl}
                target="_blank"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-sm font-medium transition hover:bg-muted"
              >
                Download CV
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
