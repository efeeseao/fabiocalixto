"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  deleteSubscriber,
  toggleSubscriberStatus,
} from "@/app/actions/subscribers";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreHorizontalIcon,
  Delete01Icon,
  Loading02Icon,
  CancelCircleIcon,
  CheckmarkCircle01Icon,
} from "hugeicons-react";

interface SubscriberActionsProps {
  subscriber: {
    id: string;
    email: string;
    isActive: boolean;
  };
}

export function SubscriberActions({ subscriber }: SubscriberActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleToggleStatus = async () => {
    setIsLoading(true);
    const result = await toggleSubscriberStatus(
      subscriber.id,
      subscriber.isActive,
    );
    if (result.success) {
      toast.success(
        `Subscritor ${subscriber.isActive ? "desativado" : "ativado"} com sucesso.`,
      );
    } else {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const result = await deleteSubscriber(subscriber.id);
    if (result.success) {
      toast.success("Subscritor apagado com sucesso.");
      setShowDeleteAlert(false);
    } else {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
            <span className="sr-only">Abrir menu</span>
            {isLoading ? (
              <Loading02Icon className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <MoreHorizontalIcon className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleToggleStatus}
            className="cursor-pointer py-2"
          >
            {subscriber.isActive ? (
              <>
                <CancelCircleIcon className="mr-2 h-4 w-4" /> Desativar
                Subscritor
              </>
            ) : (
              <>
                <CheckmarkCircle01Icon className="mr-2 h-4 w-4" /> Ativar
                Subscritor
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setShowDeleteAlert(true);
            }}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer py-2"
          >
            <Delete01Icon className="mr-2 h-4 w-4" />
            Apagar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tens a certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto irá apagar permanentemente o
              email{" "}
              <strong className="text-foreground">{subscriber.email}</strong> da
              tua lista.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loading02Icon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Delete01Icon className="mr-2 h-4 w-4" />
              )}
              Apagar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
