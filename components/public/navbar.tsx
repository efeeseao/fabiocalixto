"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { path: "/", label: "Início" },
  { path: "/sobre", label: "Sobre" },
  { path: "/artigos", label: "Artigos" },
  { path: "/projetos", label: "Projetos" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <div className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
      <nav className="flex items-center gap-1 rounded-full border border-border/40 bg-background/80 px-3 py-2 shadow-sm backdrop-blur-md">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "relative px-4 py-1.5 text-sm font-medium transition-colors hover:text-primary",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              {isActive && (
                <span className="absolute inset-0 rounded-full bg-muted/50 -z-10" />
              )}
              {item.label}
            </Link>
          );
        })}

        <div className="mx-1 h-5 w-px bg-border/50" />

        <ThemeToggle />
      </nav>
    </div>
  );
}
