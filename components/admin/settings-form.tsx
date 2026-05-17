"use client";

import { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldSeparator,
} from "@/components/ui/field";

import { updateSiteSettings } from "@/app/actions/settings";
import { RichTextEditor } from "@/components/editor";
import { useUploadThing } from "@/lib/uploadthing";
import { Loading02Icon, Delete01Icon, Image01Icon } from "hugeicons-react";

const settingsSchema = z.object({
  heroTitle: z.string().min(1, "O título é obrigatório."),
  heroDescription: z.string().min(1, "A descrição é obrigatória."),
  aboutText: z.string().optional(),
  avatarUrl: z.string().optional(),
  githubUrl: z.string().url("URL inválido").or(z.literal("")).optional(),
  linkedinUrl: z.string().url("URL inválido").or(z.literal("")).optional(),
  twitterUrl: z.string().url("URL inválido").or(z.literal("")).optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export function SettingsForm({
  initialData,
}: {
  initialData: Partial<SettingsFormValues>;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      heroTitle: initialData?.heroTitle || "",
      heroDescription: initialData?.heroDescription || "",
      aboutText: initialData?.aboutText || "",
      avatarUrl: initialData?.avatarUrl || "",
      githubUrl: initialData?.githubUrl || "",
      linkedinUrl: initialData?.linkedinUrl || "",
      twitterUrl: initialData?.twitterUrl || "",
    },
  });

  const avatarUrl = useWatch({ control, name: "avatarUrl" });

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        setValue("avatarUrl", res[0].url);
        toast.success("Foto de perfil carregada com sucesso!");
      }
    },
    onUploadError: (error: Error) => {
      toast.error(`Erro ao carregar a foto: ${error.message}`);
    },
  });

  async function onSubmit(data: SettingsFormValues) {
    setIsLoading(true);
    const result = await updateSiteSettings(data);

    if (result.success) {
      toast.success("Definições guardadas com sucesso!");
    } else {
      toast.error(result.error || "Ocorreu um erro.");
    }
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="space-y-8">
        <FieldSet>
          <FieldLegend>Foto de Perfil</FieldLegend>
          <FieldDescription>
            A foto que será mostrada na página &quot;Sobre&quot; e na
            &quot;Página Inicial&quot;.
          </FieldDescription>
          <div className="mt-4">
            {avatarUrl ? (
              <div className="relative group overflow-hidden rounded-full border border-border/50 aspect-square w-32 bg-muted/20">
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="rounded-full"
                    onClick={() => setValue("avatarUrl", "")}
                  >
                    <Delete01Icon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center w-32 aspect-square border-2 border-dashed border-border/60 hover:border-primary/50 transition-colors bg-muted/10 rounded-full cursor-pointer overflow-hidden group focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
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
                  <div className="flex flex-col items-center gap-1 text-muted-foreground z-0">
                    <Loading02Icon className="h-5 w-5 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1 text-muted-foreground z-0 group-hover:text-foreground transition-colors">
                    <Image01Icon className="h-6 w-6 opacity-50 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[10px] font-medium text-center px-2">
                      Upload
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </FieldSet>

        <FieldSeparator />

        <FieldSet>
          <FieldLegend>Apresentação (Hero)</FieldLegend>
          <FieldDescription>
            O texto principal que aparece na página inicial.
          </FieldDescription>
          <FieldGroup className="mt-4 space-y-4">
            <Field>
              <FieldLabel htmlFor="heroTitle">Título Principal</FieldLabel>
              <Input
                id="heroTitle"
                placeholder="Ex: Software Engineer & Builder"
                className="h-12"
                {...register("heroTitle")}
              />
              {errors.heroTitle && (
                <p className="text-sm text-destructive">
                  {errors.heroTitle.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="heroDescription">Descrição Curta</FieldLabel>
              <Textarea
                id="heroDescription"
                placeholder="Uma breve introdução sobre ti..."
                className="resize-none h-24"
                {...register("heroDescription")}
              />
              {errors.heroDescription && (
                <p className="text-sm text-destructive">
                  {errors.heroDescription.message}
                </p>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>

        <FieldSeparator />

        <FieldSet>
          <FieldLegend>Sobre Mim</FieldLegend>
          <FieldDescription>
            A tua biografia detalhada. Podes usar formatação, links e imagens.
          </FieldDescription>
          <div className="mt-4">
            <Controller
              name="aboutText"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  content={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Escreve a tua história aqui..."
                />
              )}
            />
          </div>
        </FieldSet>

        <FieldSeparator />

        <FieldSet>
          <FieldLegend>Redes Sociais</FieldLegend>
          <FieldDescription>
            Links para os teus perfis públicos.
          </FieldDescription>
          <FieldGroup className="mt-4 space-y-4">
            <Field>
              <FieldLabel htmlFor="githubUrl">GitHub URL</FieldLabel>
              <Input
                id="githubUrl"
                placeholder="https://github.com/teu-user"
                className="h-12"
                {...register("githubUrl")}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="linkedinUrl">LinkedIn URL</FieldLabel>
              <Input
                id="linkedinUrl"
                placeholder="https://linkedin.com/in/teu-user"
                className="h-12"
                {...register("linkedinUrl")}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="twitterUrl">Twitter / X URL</FieldLabel>
              <Input
                id="twitterUrl"
                placeholder="https://x.com/teu-user"
                className="h-12"
                {...register("twitterUrl")}
              />
            </Field>
          </FieldGroup>
        </FieldSet>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isLoading || isUploading}
            className="h-12 w-full sm:w-auto px-8"
          >
            {isLoading && (
              <Loading02Icon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Guardar Definições
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
