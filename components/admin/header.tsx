"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu01Icon,
  CubeIcon,
  UserCircleIcon,
  Logout01Icon,
} from "hugeicons-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cmsNavLinks } from "@/utils/config";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { CommandMenu } from "@/components/admin/command-menu";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/40 bg-background/80 backdrop-blur-md px-4 lg:px-8">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
            <Menu01Icon className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col border-r-0">
          <SheetTitle className="sr-only">Menu de Navegação</SheetTitle>
          <nav className="grid gap-2 text-lg font-medium mt-4">
            <Link
              href="/cms"
              className="flex items-center gap-3 text-lg font-semibold mb-8 px-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <CubeIcon className="h-5 w-5" fill="solid" />
              </div>
              <span className="tracking-tight">Fábio Calixto</span>
            </Link>
            {cmsNavLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-4 rounded-xl px-3 py-2.5 transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                  )}
                >
                  <Icon
                    className="h-5 w-5"
                    fill={isActive ? "solid" : "stroke"}
                  />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex w-full flex-1 items-center gap-4 md:ml-auto md:w-auto md:gap-2 lg:gap-4">
        <CommandMenu />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full ring-2 ring-transparent transition-all hover:ring-border"
          >
            <UserCircleIcon className="h-9 w-9 text-muted-foreground" />
            <span className="sr-only">Menu de Utilizador</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-xl">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Fábio Calixto</p>
              <p className="text-xs leading-none text-muted-foreground">
                Administrador
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-destructive cursor-pointer rounded-lg focus:bg-destructive/10 focus:text-destructive"
          >
            <Logout01Icon className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
