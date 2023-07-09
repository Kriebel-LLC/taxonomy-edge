import Content, {
  // @ts-ignore
  meta,
} from "@/content/docs/documentation/index.mdx";
import DocTemplate from "@/app/(info)/docs/doc-template";
import { mapMetadata } from "@/lib/utils";

export const runtime = "edge";

export async function generateMetadata() {
  return mapMetadata(meta);
}

export default async function Page() {
  return <DocTemplate content={Content} metadata={meta} />;
}
