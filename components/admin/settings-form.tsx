"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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

const settingsSchema = z.object({
  heroTitle: z.string().min(1, "O título é obrigatório."),
  heroDescription: z.string().min(1, "A descrição é obrigatória."),
  aboutText: z.string().optional(),
  githubUrl: z.string().url("URL inválido").or(z.literal("")),
  linkedinUrl: z.string().url("URL inválido").or(z.literal("")),
  twitterUrl: z.string().url("URL inválido").or(z.literal("")),
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
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      heroTitle: initialData?.heroTitle || "",
      heroDescription: initialData?.heroDescription || "",
      aboutText: initialData?.aboutText || "",
      githubUrl: initialData?.githubUrl || "",
      linkedinUrl: initialData?.linkedinUrl || "",
      twitterUrl: initialData?.twitterUrl || "",
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
              {errors.githubUrl && (
                <p className="text-sm text-destructive">
                  {errors.githubUrl.message}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="linkedinUrl">LinkedIn URL</FieldLabel>
              <Input
                id="linkedinUrl"
                placeholder="https://linkedin.com/in/teu-user"
                className="h-12"
                {...register("linkedinUrl")}
              />
              {errors.linkedinUrl && (
                <p className="text-sm text-destructive">
                  {errors.linkedinUrl.message}
                </p>
              )}
            </Field>
          </FieldGroup>
        </FieldSet>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full sm:w-auto px-8"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Definições
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
