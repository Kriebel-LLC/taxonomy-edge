import { DashboardHeader } from "@/custom-components/header";
import { PostCreateButton } from "@/custom-components/post-create-button";
import { PostItem } from "@/custom-components/post-item";
import { DashboardShell } from "@/custom-components/shell";

export default function DashboardLoading() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Posts" text="Create and manage posts.">
        <PostCreateButton />
      </DashboardHeader>
      <div className="divide-border-200 divide-y rounded-md border">
        <PostItem.Skeleton />
        <PostItem.Skeleton />
        <PostItem.Skeleton />
        <PostItem.Skeleton />
        <PostItem.Skeleton />
      </div>
    </DashboardShell>
  );
}
