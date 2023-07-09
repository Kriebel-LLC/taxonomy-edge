import { notFound, redirect } from "next/navigation";
import dynamic from "next/dynamic";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { getCurrentServerUser } from "@/lib/session";
import { eq, and } from "drizzle-orm";
import type { Post, User } from "@/db/schema";
import { cookies } from "next/headers";
import { Skeleton } from "components/ui/skeleton";

export const runtime = "edge";

async function getPostForUser(
  postId: Post["id"],
  userId: User["id"]
): Promise<Post | undefined> {
  return (
    await db
      .select()
      .from(posts)
      .where(and(eq(posts.id, postId), eq(posts.authorId, userId)))
      .limit(1)
  )[0];
}

const Editor = dynamic(() => import("@/custom-components/editor"), {
  loading: () => <Skeleton className="h-4 w-[200px]" />,
  ssr: false,
});

interface EditorPageProps {
  params: { postId: string };
}

export default async function EditorPage({ params }: EditorPageProps) {
  const user = await getCurrentServerUser(cookies());

  if (!user) {
    redirect("/login");
  }

  const post = await getPostForUser(params.postId, user.uid);

  if (!post) {
    notFound();
  }

  return (
    <Editor
      post={{
        id: post.id,
        title: post.title,
        content: post.content,
        published: post.published,
      }}
    />
  );
}
