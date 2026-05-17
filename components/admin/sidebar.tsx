"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { cmsNavLinks } from "@/utils/config";
import { CubeIcon, Logout01Icon } from "hugeicons-react";
import { authClient } from "@/lib/auth-client";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="hidden shrink-0 bg-background md:block md:w-64 lg:w-72 border-r border-border/40">
      <div className="flex h-full max-h-screen flex-col">
        <div className="flex h-16 items-center px-6 border-b border-border/40">
          <Link
            href="/cms"
            className="flex items-center gap-3 font-semibold transition-opacity hover:opacity-80"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <CubeIcon className="h-5 w-5" fill="solid" />
            </div>
            <span className="text-lg tracking-tight">Fábio Calixto</span>
          </Link>
        </div>

        <div className="flex-1 overflow-auto px-4 py-4">
          <nav className="grid items-start gap-1.5 text-sm font-medium">
            {cmsNavLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 transition-all outline-none",
                    isActive
                      ? "bg-accent/80 text-accent-foreground font-medium shadow-sm"
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
        </div>

        <div className="p-4 border-t border-border/40">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive outline-none"
          >
            <Logout01Icon className="h-5 w-5" />
            Terminar Sessão
          </button>
        </div>
      </div>
    </aside>
  );
}
