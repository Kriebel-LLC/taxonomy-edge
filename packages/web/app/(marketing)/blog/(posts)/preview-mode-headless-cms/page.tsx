// @ts-ignore
import Content, { meta } from "@/content/blog/preview-mode-headless-cms.mdx";
import PostTemplate from "@/app/(marketing)/blog/(posts)/post-template";
import { mapMetadata } from "@/lib/utils";

export const runtime = "edge";

export async function generateMetadata() {
  return mapMetadata(meta);
}

export default async function Page() {
  return <PostTemplate content={Content} metadata={meta} />;
}
