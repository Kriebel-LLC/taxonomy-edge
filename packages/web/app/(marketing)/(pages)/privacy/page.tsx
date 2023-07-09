// @ts-ignore
import Privacy, { meta } from "@/content/pages/privacy.mdx";
import PageTemplate from "@/app/(marketing)/(pages)/page-template";
import { mapMetadata } from "@/lib/utils";

export const runtime = "edge";

export async function generateMetadata() {
  return mapMetadata(meta);
}

export default async function PrivacyPage() {
  return <PageTemplate content={Privacy} metadata={meta} />;
}
