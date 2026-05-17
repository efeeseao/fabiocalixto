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

import { saveExperience } from "@/app/actions/experiences";
import { RichTextEditor } from "@/components/editor";
import { useUploadThing } from "@/lib/uploadthing";
import { Loading02Icon, Delete01Icon, Image01Icon } from "hugeicons-react";

const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, "A empresa é obrigatória."),
  role: z.string().min(1, "O cargo é obrigatório."),
  startDate: z.string().min(1, "A data de início é obrigatória."),
  endDate: z.string().optional(),
  description: z.string().optional(),
  logoUrl: z.string().optional(),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

export function ExperienceForm({
  initialData,
}: {
  initialData?: Partial<ExperienceFormValues>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      id: initialData?.id,
      company: initialData?.company || "",
      role: initialData?.role || "",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      description: initialData?.description || "",
      logoUrl: initialData?.logoUrl || "",
    },
  });

  const logoUrl = useWatch({ control, name: "logoUrl" });

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        setValue("logoUrl", res[0].ufsUrl);
        toast.success("Logótipo carregado com sucesso!");
      }
    },
    onUploadError: (error: Error) => {
      toast.error(`Erro ao carregar a imagem: ${error.message}`);
    },
  });

  const onSubmit: SubmitHandler<ExperienceFormValues> = async (data) => {
    setIsLoading(true);
    const result = await saveExperience(data);

    if (result.success) {
      toast.success("Experiência guardada com sucesso!");
      router.push("/cms/experiences");
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="role">Cargo / Posição</FieldLabel>
              <Input
                id="role"
                placeholder="Ex: Senior Frontend Engineer"
                className="h-12"
                {...register("role")}
              />
              {errors.role && (
                <p className="text-sm text-destructive">
                  {errors.role.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="company">Empresa</FieldLabel>
              <Input
                id="company"
                placeholder="Ex: Google"
                className="h-12"
                {...register("company")}
              />
              {errors.company && (
                <p className="text-sm text-destructive">
                  {errors.company.message}
                </p>
              )}
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="startDate">Data de Início</FieldLabel>
              <Input
                id="startDate"
                placeholder="Ex: Jan 2020"
                className="h-12"
                {...register("startDate")}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">
                  {errors.startDate.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="endDate">Data de Fim</FieldLabel>
              <Input
                id="endDate"
                placeholder="Ex: Presente ou Dez 2023"
                className="h-12"
                {...register("endDate")}
              />
            </Field>
          </div>

          <Field>
            <FieldLabel className="text-base">
              Descrição e Conquistas
            </FieldLabel>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  content={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Descreve as tuas responsabilidades e principais conquistas..."
                />
              )}
            />
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
              {initialData?.id
                ? "Atualizar Experiência"
                : "Adicionar Experiência"}
            </Button>
          </FieldGroup>
        </FieldSet>

        <FieldSet className="rounded-xl border border-border/40 bg-card p-5 shadow-sm">
          <FieldLegend className="text-base font-semibold">
            Logótipo da Empresa
          </FieldLegend>
          <FieldDescription className="mt-1">
            Imagem quadrada. Fica melhor com fundo transparente.
          </FieldDescription>
          <div className="mt-4">
            {logoUrl ? (
              <div className="relative group overflow-hidden rounded-xl border border-border/50 aspect-square w-32 mx-auto bg-muted/20">
                <Image
                  src={logoUrl}
                  alt="Logo"
                  fill
                  className="object-cover p-2"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => setValue("logoUrl", "")}
                  >
                    <Delete01Icon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center w-full py-8 border-2 border-dashed border-border/60 hover:border-primary/50 transition-colors bg-muted/10 rounded-xl cursor-pointer overflow-hidden group focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
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
                    <Loading02Icon className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-xs font-medium">A carregar...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground z-0 group-hover:text-foreground transition-colors">
                    <Image01Icon className="h-8 w-8 mb-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm font-medium text-center px-4">
                      Upload Logótipo
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </FieldSet>
      </div>
    </form>
  );
}
