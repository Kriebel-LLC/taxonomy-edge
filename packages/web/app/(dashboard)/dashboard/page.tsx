import { redirect } from "next/navigation";

import { db } from "@/db";
import { getCurrentServerUser } from "@/lib/session";
import { EmptyPlaceholder } from "@/custom-components/empty-placeholder";
import { DashboardHeader } from "@/custom-components/header";
import { PostCreateButton } from "@/custom-components/post-create-button";
import { PostItem } from "@/custom-components/post-item";
import { DashboardShell } from "@/custom-components/shell";
import { posts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";

export const runtime = "edge";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentServerUser(cookies());

  if (!user) {
    redirect("/login");
  }

  const dbPosts = await db()
    .select({
      id: posts.id,
      title: posts.title,
      published: posts.published,
      createdAt: posts.createdAt,
    })
    .from(posts)
    .where(eq(posts.authorId, user.uid))
    .orderBy(desc(posts.updatedAt));

  return (
    <DashboardShell>
      <DashboardHeader heading="Posts" text="Create and manage posts.">
        <PostCreateButton />
      </DashboardHeader>
      <div>
        {dbPosts?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {dbPosts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No posts created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any posts yet. Start creating content.
            </EmptyPlaceholder.Description>
            <PostCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  );
}
