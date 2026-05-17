import { ReactNode } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { Header } from "@/components/admin/header";

export default function CMSLayout({ children }: { children: ReactNode }) {
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
