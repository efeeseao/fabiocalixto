"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteProject } from "@/app/actions/projects";
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
  PencilEdit01Icon,
  Delete01Icon,
  Loading02Icon,
} from "hugeicons-react";
import Link from "next/link";

interface ProjectActionsProps {
  project: {
    id: string;
    title: string;
  };
}

export function ProjectActions({ project }: ProjectActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const result = await deleteProject(project.id);
    if (result.success) {
      toast.success("Projeto apagado com sucesso.");
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

          <Link href={`/cms/projects/${project.id}`}>
            <DropdownMenuItem className="cursor-pointer py-2">
              <PencilEdit01Icon className="mr-2 h-4 w-4" />
              Editar Projeto
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setShowDeleteAlert(true);
            }}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer py-2"
          >
            <Delete01Icon className="mr-2 h-4 w-4" />
            Apagar Projeto
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tens a certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto irá apagar permanentemente o
              projeto{" "}
              <strong className="text-foreground">
                &quot;{project.title}&quot;
              </strong>{" "}
              e todos os dados associados.
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
