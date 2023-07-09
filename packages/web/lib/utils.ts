import { env } from "@/env.mjs";
import { Metadata } from "next";

export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`;
}

export function dateToMySQLDateString(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export function mapMetadata(metadata: any): Metadata {
  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: "article",
      url: absoluteUrl(metadata.slug),
      // images: [
      //   {
      //     url: ogUrl.toString(),
      //     width: 1200,
      //     height: 630,
      //     alt: page.title,
      //   },
      // ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      // images: [ogUrl.toString()],
    },
  };
}
