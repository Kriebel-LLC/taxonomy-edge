import "@/styles/mdx.css";
// import { getTableOfContents } from "@/lib/toc";
import { DocsPageHeader } from "@/custom-components/page-header";
import { DocsPager } from "@/custom-components/pager";
// import { DashboardTableOfContents } from "@/custom-components/toc";
import type { MDXContent } from "mdx/types";

interface DocPageProps {
  metadata: any;
  content: MDXContent;
}

export default function DocPage(props: DocPageProps) {
  const doc = props.metadata;

  // const toc = await getTableOfContents(doc.body.raw);

  return (
    <main className="relative py-6 lg:gap-10 lg:py-10 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <DocsPageHeader heading={doc.title} text={doc.description} />
        <div className="mdx">
          <props.content />
        </div>
        <hr className="my-4 md:my-6" />
        <DocsPager doc={doc} />
      </div>
      {/* <div className="hidden text-sm xl:block">
        <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
          <DashboardTableOfContents toc={toc} />
        </div>
      </div> */}
    </main>
  );
}
