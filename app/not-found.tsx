import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft02Icon, SearchFocusIcon } from "hugeicons-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center selection:bg-primary/30">
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50" />

      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted/50 ring-1 ring-border/50 shadow-sm">
          <SearchFocusIcon className="h-10 w-10 text-muted-foreground" />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Erro 404
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Página não encontrada
          </h1>
          <p className="mt-6 max-w-md text-base text-muted-foreground leading-relaxed mx-auto">
            Desculpa, não conseguimos encontrar a página que procuras. É
            possível que o link esteja quebrado, a página tenha sido movida ou
            removida.
          </p>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4">
          <Link href="/">
            <Button className="gap-2 h-12 px-8 rounded-full text-base">
              <ArrowLeft02Icon className="h-5 w-5" />
              Voltar ao Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
