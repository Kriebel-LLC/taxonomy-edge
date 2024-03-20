import Link from "next/link";

// import { getTableOfContents } from "@/lib/toc";
import { Icons } from "@/custom-components/icons";
import { DocsPageHeader } from "@/custom-components/page-header";
// import { DashboardTableOfContents } from "@/custom-components/toc";
import type { MDXContent } from "mdx/types";

import "@/styles/mdx.css";

import { cn } from "components/lib/utils";
import { buttonVariants } from "components/ui/button";

interface GuidePageProps {
  metadata: any;
  content: MDXContent;
}

export default function GuidePage(props: GuidePageProps) {
  const guide = props.metadata;

  // const toc = await getTableOfContents(guide.body.raw);

  return (
    <main className="relative py-6 lg:grid lg:grid-cols-[1fr_300px] lg:gap-10 lg:py-10 xl:gap-20">
      <div>
        <DocsPageHeader heading={guide.title} text={guide.description} />
        <div className="mdx">
          <props.content />
        </div>
        <hr className="my-4" />
        <div className="flex justify-center py-6 lg:py-10">
          <Link
            href="/guides"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            <Icons.chevronLeft className="mr-2 size-4" />
            See all guides
          </Link>
        </div>
      </div>
      {/* <div className="hidden text-sm lg:block">
        <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-10">
          <DashboardTableOfContents toc={toc} />
        </div>
      </div> */}
    </main>
  );
}
