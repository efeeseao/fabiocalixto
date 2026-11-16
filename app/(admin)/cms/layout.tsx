import type { Metadata } from "next";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";
import { getSession, isApprovedAdmin } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "CMS",
  robots: { index: false, follow: false },
};

export default async function CMSLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (!isApprovedAdmin(session.user)) {
    redirect("/");
  }

  return (
    <div className="grid h-screen w-full overflow-hidden md:grid-cols-[256px_1fr] lg:grid-cols-[288px_1fr]">
      <Sidebar />
      <div className="relative flex h-full flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
