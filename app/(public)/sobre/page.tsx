import Image from "next/image";
import prisma from "@/lib/prisma";
import {
  GithubIcon,
  Linkedin01Icon,
  TwitterIcon,
  Mail01Icon,
} from "hugeicons-react";

export const metadata = {
  title: "Sobre | Fábio Calixto",
  description: "Um pouco sobre mim, o meu percurso e o que me motiva.",
};

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "global" },
  });

  return (
    <div className="mx-auto max-w-2xl lg:max-w-5xl">
      <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-12 lg:gap-y-12 lg:gap-x-12">
        <div className="lg:order-last lg:col-span-5 lg:col-start-8">
          <div className="flex flex-col gap-10 lg:sticky lg:top-32">
            <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-muted/50 ring-1 ring-border/50 rotate-3 hover:rotate-0 transition-transform duration-500">
              {settings?.avatarUrl ? (
                <Image
                  src={settings.avatarUrl}
                  alt="A minha foto"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 384px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground/50 bg-primary/5">
                  <span className="text-sm font-medium uppercase tracking-widest text-center px-4">
                    Tua Foto Aqui
                  </span>
                </div>
              )}
            </div>

            <ul role="list" className="flex flex-col gap-4">
              {settings?.twitterUrl && (
                <li className="flex">
                  <a
                    href={settings.twitterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors items-center"
                  >
                    <TwitterIcon className="h-5 w-5 flex-none transition group-hover:text-primary" />
                    <span className="ml-4">Seguir no Twitter</span>
                  </a>
                </li>
              )}
              {settings?.githubUrl && (
                <li className="flex">
                  <a
                    href={settings.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors items-center"
                  >
                    <GithubIcon className="h-5 w-5 flex-none transition group-hover:text-primary" />
                    <span className="ml-4">Seguir no GitHub</span>
                  </a>
                </li>
              )}
              {settings?.linkedinUrl && (
                <li className="flex">
                  <a
                    href={settings.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors items-center"
                  >
                    <Linkedin01Icon className="h-5 w-5 flex-none transition group-hover:text-primary" />
                    <span className="ml-4">Ligar no LinkedIn</span>
                  </a>
                </li>
              )}

              <li className="mt-4 flex border-t border-border/40 pt-8">
                <a
                  href={`mailto:${settings?.emailAddress || "hello@exemplo.com"}`}
                  className="group flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors items-center"
                >
                  <Mail01Icon className="h-5 w-5 flex-none transition group-hover:text-primary" />
                  <span className="ml-4">
                    {settings?.emailAddress || "hello@exemplo.com"}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-7">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-8">
            Sou apaixonado por construir coisas e partilhar conhecimento.
          </h1>

          {settings?.aboutText ? (
            <div
              className="prose prose-zinc dark:prose-invert prose-lg max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl prose-img:border prose-img:border-border/50"
              dangerouslySetInnerHTML={{ __html: settings.aboutText }}
            />
          ) : (
            <p className="text-muted-foreground text-lg leading-relaxed">
              Ainda não escreveste a tua biografia. Vai ao painel de
              administração (Definições) e preenche a secção &ldquo;Sobre
              Mim&ldquo; para que este texto apareça aqui!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
