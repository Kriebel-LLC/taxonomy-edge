import Content, {
  // @ts-ignore
  meta,
} from "@/content/guides/build-blog-using-contentlayer-mdx.mdx";
import GuideTemplate from "@/app/(info)/guides/(guides)/guide-template";
import { mapMetadata } from "@/lib/utils";

export const runtime = "edge";

export async function generateMetadata() {
  return mapMetadata(meta);
}

export default async function Page() {
  return <GuideTemplate content={Content} metadata={meta} />;
}
