"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  Controller,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldDescription,
} from "@/components/ui/field";

import { saveProject } from "@/app/actions/projects";
import { RichTextEditor } from "@/components/editor";
import { useUploadThing } from "@/lib/uploadthing";
import { Loading02Icon, Delete01Icon, Image01Icon } from "hugeicons-react";

const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "O título é obrigatório."),
  description: z.string().min(1, "A descrição é obrigatória."),
  repositoryUrl: z.string().url("URL inválido").or(z.literal("")).optional(),
  liveUrl: z.string().url("URL inválido").or(z.literal("")).optional(),
  imageUrl: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export function ProjectForm({
  initialData,
}: {
  initialData?: Partial<ProjectFormValues>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      id: initialData?.id,
      title: initialData?.title || "",
      description: initialData?.description || "",
      repositoryUrl: initialData?.repositoryUrl || "",
      liveUrl: initialData?.liveUrl || "",
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const imageUrl = useWatch({ control, name: "imageUrl" });

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        setValue("imageUrl", res[0].ufsUrl);
        toast.success("Imagem carregada com sucesso!");
      }
    },
    onUploadError: (error: Error) => {
      toast.error(`Erro ao carregar a imagem: ${error.message}`);
    },
  });

  const onSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
    setIsLoading(true);
    const result = await saveProject(data);

    if (result.success) {
      toast.success("Projeto guardado com sucesso!");
      router.push("/cms/projects");
      router.refresh();
    } else {
      toast.error(result.error || "Ocorreu um erro ao guardar.");
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-8 md:grid-cols-3"
    >
      <div className="md:col-span-2 space-y-8">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="title" className="text-base">
              Nome do Projeto
            </FieldLabel>
            <Input
              id="title"
              placeholder="Ex: E-commerce Platform"
              className="h-14 text-lg font-medium"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </Field>

          <Field>
            <FieldLabel className="text-base">
              Descrição / Case Study
            </FieldLabel>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                  placeholder="Descreve o projeto, tecnologias usadas, desafios..."
                />
              )}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </Field>
        </FieldGroup>
      </div>

      <div className="space-y-8">
        <FieldSet className="rounded-xl border border-border/40 bg-card p-5 shadow-sm">
          <FieldLegend className="text-base font-semibold">Guardar</FieldLegend>
          <FieldGroup className="mt-4">
            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className="w-full h-12 text-base"
            >
              {isLoading ? (
                <Loading02Icon className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              {initialData?.id ? "Atualizar Projeto" : "Criar Projeto"}
            </Button>
          </FieldGroup>
        </FieldSet>

        <FieldSet className="rounded-xl border border-border/40 bg-card p-5 shadow-sm">
          <FieldLegend className="text-base font-semibold">
            Imagem do Projeto
          </FieldLegend>
          <FieldDescription className="mt-1">
            Screenshot ou mockup do projeto.
          </FieldDescription>
          <div className="mt-4">
            {imageUrl ? (
              <div className="relative group overflow-hidden rounded-lg border border-border/50">
                <Image
                  src={imageUrl}
                  alt="Imagem"
                  width={400}
                  height={250}
                  className="w-full h-50 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setValue("imageUrl", "")}
                    className="gap-2"
                  >
                    <Delete01Icon className="h-4 w-4" /> Remover
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center w-full py-10 border-2 border-dashed border-border/60 hover:border-primary/50 transition-colors bg-muted/10 rounded-xl cursor-pointer overflow-hidden group focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  disabled={isUploading}
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      startUpload(Array.from(files));
                    }
                  }}
                />
                {isUploading ? (
                  <div className="flex flex-col items-center gap-3 text-muted-foreground z-0">
                    <Loading02Icon className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-sm font-medium">
                      A carregar imagem...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground z-0 group-hover:text-foreground transition-colors">
                    <Image01Icon className="h-10 w-10 mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm font-medium text-center px-4">
                      Clica ou arrasta a imagem
                    </span>
                    <span className="text-xs opacity-70">PNG, JPG até 4MB</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </FieldSet>

        <FieldSet className="rounded-xl border border-border/40 bg-card p-5 shadow-sm">
          <FieldLegend className="text-base font-semibold">Links</FieldLegend>
          <FieldDescription className="mt-1">
            Onde os utilizadores podem encontrar o projeto.
          </FieldDescription>
          <FieldGroup className="mt-4 space-y-4">
            <Field>
              <FieldLabel htmlFor="liveUrl">Link do Projeto (Live)</FieldLabel>
              <Input
                id="liveUrl"
                placeholder="https://meuprojeto.com"
                type="url"
                autoComplete="url"
                autoCorrect="url"
                className="h-12"
                {...register("liveUrl")}
              />
              {errors.liveUrl && (
                <p className="text-sm text-destructive">
                  {errors.liveUrl.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="repositoryUrl">
                Repositório (GitHub)
              </FieldLabel>
              <Input
                id="repositoryUrl"
                placeholder="https://github.com/usuario/repo"
                type="url"
                autoComplete="url"
                autoCorrect="url"
                className="h-12"
                {...register("repositoryUrl")}
              />
              {errors.repositoryUrl && (
                <p className="text-sm text-destructive">
                  {errors.repositoryUrl.message}
                </p>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
    </form>
  );
}
