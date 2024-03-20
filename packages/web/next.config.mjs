import withMdx from "@next/mdx";
import "./env.mjs";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["components"],
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
};

// setupDevPlatform is only necessary for local development testing, so only call during development
if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default withMdx()(nextConfig);
