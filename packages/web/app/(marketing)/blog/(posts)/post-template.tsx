import "@/styles/mdx.css";
import Link from "next/link";

import { formatDateInput } from "@/lib/utils";
import { cn } from "components/lib/utils";
import { buttonVariants } from "components/ui/button";
import { Icons } from "@/custom-components/icons";
import type { MDXContent } from "mdx/types";

interface PostPageProps {
  metadata: any;
  content: MDXContent;
}

export default function PostPage(props: PostPageProps) {
  const post = props.metadata;

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      <Link
        href="/blog"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "left-[-200px] absolute top-14 hidden xl:inline-flex"
        )}
      >
        <Icons.chevronLeft className="mr-2 size-4" />
        See all posts
      </Link>
      <div>
        {post.date && (
          <time
            dateTime={post.date}
            className="block text-sm text-muted-foreground"
          >
            Published on {formatDateInput(post.date)}
          </time>
        )}
        <h1 className="mt-2 inline-block font-heading text-4xl leading-tight lg:text-5xl">
          {post.title}
        </h1>
      </div>
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          width={720}
          height={405}
          className="my-8 rounded-md border bg-muted transition-colors"
        />
      )}
      <div className="mdx">
        <props.content />
      </div>
      <hr className="mt-12" />
      <div className="flex justify-center py-6 lg:py-10">
        <Link href="/blog" className={cn(buttonVariants({ variant: "ghost" }))}>
          <Icons.chevronLeft className="mr-2 size-4" />
          See all posts
        </Link>
      </div>
    </article>
  );
}
