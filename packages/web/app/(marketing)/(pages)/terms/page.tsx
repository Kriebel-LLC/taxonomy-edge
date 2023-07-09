// @ts-ignore
import Terms, { meta } from "@/content/pages/terms.mdx";
import PageTemplate from "@/app/(marketing)/(pages)/page-template";
import { mapMetadata } from "@/lib/utils";

export const runtime = "edge";

export async function generateMetadata() {
  return mapMetadata(meta);
}

export default async function TermsPage() {
  return <PageTemplate content={Terms} metadata={meta} />;
}
