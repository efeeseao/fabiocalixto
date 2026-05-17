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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldDescription,
} from "@/components/ui/field";

import { savePost } from "@/app/actions/posts";
import { RichTextEditor } from "@/components/editor";
import { useUploadThing } from "@/lib/uploadthing";
import { Loading02Icon, Delete01Icon, Image01Icon } from "hugeicons-react";
import Image from "next/image";

const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "O título é obrigatório."),
  content: z.string().min(1, "O conteúdo é obrigatório."),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  published: z.boolean(),
});

type PostFormValues = z.infer<typeof postSchema>;

export function PostForm({
  initialData,
}: {
  initialData?: Partial<PostFormValues>;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      id: initialData?.id,
      title: initialData?.title || "",
      content: initialData?.content || "",
      excerpt: initialData?.excerpt || "",
      coverImage: initialData?.coverImage || "",
      published: initialData?.published || false,
    },
  });

  const coverImage = useWatch({ control, name: "coverImage" });

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        setValue("coverImage", res[0].ufsUrl);
        toast.success("Capa carregada com sucesso!");
      }
    },
    onUploadError: (error: Error) => {
      toast.error(`Erro ao carregar a imagem: ${error.message}`);
    },
  });

  const onSubmit: SubmitHandler<PostFormValues> = async (data) => {
    setIsLoading(true);
    const result = await savePost(data);

    if (result.success) {
      toast.success("Artigo guardado com sucesso!");
      router.push("/cms/posts");
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
              Título do Artigo
            </FieldLabel>
            <Input
              id="title"
              placeholder="Ex: Como construir um CMS do zero"
              className="h-14 text-lg font-medium"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </Field>

          <Field>
            <FieldLabel className="text-base">Conteúdo</FieldLabel>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                  placeholder="Escreve o teu artigo aqui..."
                />
              )}
            />
            {errors.content && (
              <p className="text-sm text-destructive">
                {errors.content.message}
              </p>
            )}
          </Field>
        </FieldGroup>
      </div>

      <div className="space-y-8">
        <FieldSet className="rounded-xl border border-border/40 bg-card p-5 shadow-sm">
          <FieldLegend className="text-base font-semibold">
            Publicação
          </FieldLegend>
          <FieldGroup className="mt-4 space-y-6">
            <Field
              orientation="horizontal"
              className="flex items-center justify-between rounded-lg border border-border/50 p-4 bg-muted/20"
            >
              <div className="space-y-0.5">
                <FieldLabel
                  htmlFor="published"
                  className="text-base cursor-pointer"
                >
                  Publicar Artigo
                </FieldLabel>
                <FieldDescription>
                  Torna o artigo visível para todos.
                </FieldDescription>
              </div>
              <Controller
                name="published"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="published"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="h-5 w-5"
                  />
                )}
              />
            </Field>

            <Button
              type="submit"
              disabled={isLoading || isUploading}
              className="w-full h-12 text-base"
            >
              {isLoading ? (
                <Loading02Icon className="mr-2 h-5 w-5 animate-spin" />
              ) : null}
              {initialData?.id ? "Guardar Alterações" : "Criar Artigo"}
            </Button>
          </FieldGroup>
        </FieldSet>

        <FieldSet className="rounded-xl border border-border/40 bg-card p-5 shadow-sm">
          <FieldLegend className="text-base font-semibold">
            Capa do Artigo
          </FieldLegend>
          <FieldDescription className="mt-1">
            Imagem de destaque para o blog e redes sociais.
          </FieldDescription>
          <div className="mt-4">
            {coverImage ? (
              <div className="relative group overflow-hidden rounded-lg border border-border/50">
                <Image
                  src={coverImage}
                  alt="Capa"
                  width={400}
                  height={250}
                  className="w-full h-50 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setValue("coverImage", "")}
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
                    <span className="text-sm font-medium">
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
          <FieldLegend className="text-base font-semibold">
            Resumo (SEO)
          </FieldLegend>
          <FieldDescription className="mt-1">
            Breve descrição que aparece nos motores de busca.
          </FieldDescription>
          <FieldGroup className="mt-4">
            <Field>
              <Textarea
                placeholder="Escreve um breve resumo..."
                className="resize-none h-28"
                {...register("excerpt")}
              />
            </Field>
          </FieldGroup>
        </FieldSet>
      </div>
    </form>
  );
}
