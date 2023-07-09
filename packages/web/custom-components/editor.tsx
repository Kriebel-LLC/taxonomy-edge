"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Post } from "@/db/schema";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import * as z from "zod";

import "@/styles/editor.css";
import { cn } from "components/lib/utils";
import { postPatchSchema } from "@/lib/validations/post";
import { buttonVariants } from "components/ui/button";
import { toast } from "components/ui/use-toast";
import { Icons } from "@/custom-components/icons";

// NOTE: EditorJS seems to import wasm, so it currently causes `next-on-pages` builds to fail
//       For simplicity, it has been commented in this filed and replaced with a simple Text Area
//       A bug on this issue is here: https://github.com/cloudflare/next-on-pages/issues/344

interface EditorProps {
  post: Pick<Post, "id" | "title" | "content" | "published">;
}

type FormData = z.infer<typeof postPatchSchema>;

export default function Editor({ post }: EditorProps) {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(postPatchSchema),
  });
  // const ref = React.useRef<EditorJS>();
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
  const [isMounted, setIsMounted] = React.useState<boolean>(false);

  // const initializeEditor = React.useCallback(async () => {
  //   const EditorJS = (await import("@editorjs/editorjs")).default;
  //   const Header = (await import("@editorjs/header")).default;
  //   const Embed = (await import("@editorjs/embed")).default;
  //   const Table = (await import("@editorjs/table")).default;
  //   const List = (await import("@editorjs/list")).default;
  //   const Code = (await import("@editorjs/code")).default;
  //   const LinkTool = (await import("@editorjs/link")).default;
  //   const InlineCode = (await import("@editorjs/inline-code")).default;

  //   const body = postPatchSchema.parse(post);

  //   if (!ref.current) {
  //     const editor = new EditorJS({
  //       holder: "editor",
  //       onReady() {
  //         ref.current = editor;
  //       },
  //       placeholder: "Type here to write your post...",
  //       inlineToolbar: true,
  //       data: body.content,
  //       tools: {
  //         header: Header,
  //         linkTool: LinkTool,
  //         list: List,
  //         code: Code,
  //         inlineCode: InlineCode,
  //         table: Table,
  //         embed: Embed,
  //       },
  //     });
  //   }
  // }, [post]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  // React.useEffect(() => {
  //   if (isMounted) {
  //     initializeEditor();

  //     return () => {
  //       ref.current?.destroy();
  //       ref.current = undefined;
  //     };
  //   }
  // }, [isMounted, initializeEditor]);

  async function onSubmit(data: FormData) {
    setIsSaving(true);

    // const blocks = await ref.current?.save();

    const response = await fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        content: data.content,
      }),
    });

    setIsSaving(false);

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your post was not saved. Please try again.",
        variant: "destructive",
      });
    }

    router.refresh();

    return toast({
      description: "Your post has been saved.",
    });
  }

  if (!isMounted) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full gap-10">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-10">
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <>
                <Icons.chevronLeft className="mr-2 h-4 w-4" />
                Back
              </>
            </Link>
            <p className="text-sm text-muted-foreground">
              {post.published ? "Published" : "Draft"}
            </p>
          </div>
          <button type="submit" className={cn(buttonVariants())}>
            {isSaving && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save</span>
          </button>
        </div>
        <div className="prose prose-stone mx-auto w-[800px] dark:prose-invert">
          <TextareaAutosize
            autoFocus
            id="title"
            defaultValue={post.title}
            placeholder="Post title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
            {...register("title")}
          />
          <TextareaAutosize
            id="content"
            defaultValue={post.content as any}
            placeholder="Post content"
            className="flex min-h-[500px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            {...register("content")}
          />
        </div>
      </div>
    </form>
  );
}
