import { getSubscribers } from "@/app/actions/subscribers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserMultiple02Icon } from "hugeicons-react";
import { SubscriberActions } from "@/components/admin/subscriber-actions";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export default async function SubscribersPage() {
  const { data: subscribers } = await getSubscribers();

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscritores</h1>
          <p className="text-muted-foreground mt-1">
            Gere a tua lista de emails e newsletter.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border/40 bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Email</TableHead>
              <TableHead className="w-37.5">Estado</TableHead>
              <TableHead className="hidden md:table-cell w-50">
                Data de Inscrição
              </TableHead>
              <TableHead className="text-right w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <UserMultiple02Icon className="h-10 w-10 mb-3 opacity-50" />
                    <p className="text-base font-medium">Nenhum subscritor</p>
                    <p className="text-sm mt-1">
                      Ainda ninguém subscreveu a tua newsletter.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              subscribers?.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">
                    {subscriber.email}
                    <div className="text-xs text-muted-foreground md:hidden mt-1">
                      {format(
                        new Date(subscriber.subscribedAt),
                        "dd MMM, yyyy",
                        { locale: pt },
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {subscriber.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-500">
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-muted-foreground/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Inativo
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {format(new Date(subscriber.subscribedAt), "dd MMM, yyyy", {
                      locale: pt,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <SubscriberActions subscriber={subscriber} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
