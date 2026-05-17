import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/40 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-6 sm:flex-row lg:px-8">
        <div className="flex gap-6 text-sm font-medium text-muted-foreground">
          <Link
            href="/sobre"
            className="hover:text-foreground transition-colors"
          >
            Sobre
          </Link>
          <Link
            href="/projetos"
            className="hover:text-foreground transition-colors"
          >
            Projetos
          </Link>
          <Link
            href="/artigos"
            className="hover:text-foreground transition-colors"
          >
            Artigos
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Fábio Calixto. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
