import withMdx from "@next/mdx";
import "./env.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["components"],
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
};

export default withMdx()(nextConfig);
