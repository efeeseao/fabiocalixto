"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search02Icon } from "hugeicons-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cmsNavLinks } from "@/utils/config";

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-64 lg:w-80"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">
          <Search02Icon className="mr-2 h-4 w-4" /> Pesquisar no CMS...
        </span>
        <span className="inline-flex lg:hidden">
          <Search02Icon className="mr-2 h-4 w-4" /> Pesquisar...
        </span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.45rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Escreve um comando ou pesquisa..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Navegação">
            {cmsNavLinks.map((link) => {
              const Icon = link.icon;
              return (
                <CommandItem
                  key={link.href}
                  onSelect={() => runCommand(() => router.push(link.href))}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {link.name}
                </CommandItem>
              );
            })}
          </CommandGroup>
          <CommandGroup heading="Ações Rápidas">
            <CommandItem
              onSelect={() => runCommand(() => router.push("/cms/posts/new"))}
            >
              Novo Artigo
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/cms/projects/new"))
              }
            >
              Novo Projeto
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
