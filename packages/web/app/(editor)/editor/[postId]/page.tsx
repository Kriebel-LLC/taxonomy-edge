import { notFound, redirect } from "next/navigation";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { getCurrentServerUser } from "@/lib/session";
import { eq, and } from "drizzle-orm";
import type { Post, User } from "@/db/schema";
import { cookies } from "next/headers";
import Editor from "@/custom-components/editor";

export const runtime = "edge";

async function getPostForUser(
  postId: Post["id"],
  userId: User["id"]
): Promise<Post | undefined> {
  return (
    await db()
      .select()
      .from(posts)
      .where(and(eq(posts.id, postId), eq(posts.authorId, userId)))
      .limit(1)
  )[0];
}

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
