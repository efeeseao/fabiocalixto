"use client";

import { useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  TextBoldIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  Heading01Icon,
  Heading02Icon,
  CodeCircleIcon,
  Link01Icon,
  Image01Icon,
  Task01Icon,
  ListViewIcon,
  Loading02Icon,
} from "hugeicons-react";

import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        addImage(res[0].url);
        toast.success("Imagem inserida com sucesso!");
      }
    },
    onUploadError: (error: Error) => {
      toast.error(`Erro ao carregar imagem: ${error.message}`);
    },
  });

  if (!editor) {
    return null;
  }

  const setLink = () => {
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setIsLinkDialogOpen(false);
    setLinkUrl("");
  };

  const addImage = (url: string) => {
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    setIsImageDialogOpen(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border/40 bg-muted/20 p-2">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <TextBoldIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <TextItalicIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <TextStrikethroughIcon className="h-4 w-4" />
      </Toggle>

      <div className="mx-2 h-6 w-px bg-border/50" />

      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 1 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        <Heading01Icon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("heading", { level: 2 })}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        <Heading02Icon className="h-4 w-4" />
      </Toggle>

      <div className="mx-2 h-6 w-px bg-border/50" />

      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <Task01Icon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListViewIcon className="h-4 w-4" />
      </Toggle>

      <div className="mx-2 h-6 w-px bg-border/50" />

      <Toggle
        size="sm"
        pressed={editor.isActive("codeBlock")}
        onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <CodeCircleIcon className="h-4 w-4" />
      </Toggle>

      <div className="mx-2 h-6 w-px bg-border/50" />

      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogTrigger asChild>
          <Toggle size="sm" pressed={editor.isActive("link")}>
            <Link01Icon className="h-4 w-4" />
          </Toggle>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Inserir Link</DialogTitle>
            <DialogDescription>
              Escreve o URL para onde este texto deve apontar.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <Input
              id="link"
              placeholder="https://exemplo.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setLink();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button onClick={setLink}>Guardar Link</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogTrigger asChild>
          <Toggle size="sm">
            <Image01Icon className="h-4 w-4" />
          </Toggle>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Carregar Imagem</DialogTitle>
            <DialogDescription>
              Faz o upload de uma imagem do teu computador para a inserir no
              texto.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Começa a escrever...",
}: EditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4 cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class:
            "rounded-xl border border-border/50 max-h-[500px] object-cover mx-auto",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[400px] p-6 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="rounded-xl border border-border/40 bg-background overflow-hidden shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-1 focus-within:ring-ring/20">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
