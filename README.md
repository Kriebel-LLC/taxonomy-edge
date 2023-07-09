# Taxonomy at the Edge

A version of [shadcn's taxonomy](https://github.com/shadcn/taxonomy) starter application optimized to run in the [Edge Runtime](https://edge-runtime.vercel.app/).

> **Warning**
> This app is an experimental application, primarily meant as a starting point, and may have bugs.
> This is a fork of [taxonomy](https://github.com/shadcn/taxonomy), and has diverged. 

## Why?
To deploy a pre-built, state-of-the-art Next.js application on Cloudflare Pages, which [requires the edge runtime](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#use-the-edge-runtime), though this repo can be deployed where edge runtime is supported.

Edge applications are often deployed more broadly, to "edge" servers close to users, and supports 0ms cold starts, unlike regular serverless applications. Because of this, performance may increase. Read more [here](https://workers.cloudflare.com/).

## Features

Changes to the original taxonomy repo are ~~struckthrough~~

- New `/app` dir
- Routing, Layouts, Nested Layouts and Layout Groups
- Data Fetching, Caching and Mutation
- Loading UI
- Route handlers
- Metadata files
- Server and Client Components
- API Routes and Middlewares
- Authentication using ~~NextAuth.js~~ **Firebase Auth** with [`next-firebase-auth-edge`](https://github.com/awinogrodzki/next-firebase-auth-edge)
- - Why? The `next-auth` package is [currently incompatible](https://github.com/nextauthjs/next-auth/discussions/5855#discussioncomment-4564329) with the edge runtime. 
- - `next-firebase-auth-edge` allows easy use of cookies, to seamlessly power auth in server components, rather than send JWTs manually every request
- ORM using ~~Prisma~~ **Drizzle**
- - Prisma is [not currently compatible](https://github.com/prisma/prisma/issues/19500) with edge runtime
- Database on **PlanetScale** using the [Serverless Driver](https://github.com/planetscale/database-js)
- UI Components built using **Radix UI**
- Documentation and blog using **MDX** ~~and Contentlayer~~ and `next/mdx`
- - Contentlayer seems to generate code that is evaluated during runtime. This evaluation uses [edge runtime-incompatible APIs](https://github.com/contentlayerdev/contentlayer/blob/main/packages/next-contentlayer/src/hooks/useMDXComponent.ts#L24).
- Subscriptions using **Stripe**, [adapted](https://blog.cloudflare.com/announcing-stripe-support-in-workers/) to work in edge runtime
- Styled using **Tailwind CSS**
- Validations using **Zod**
- Written in **TypeScript**

## What's different?

Compared to the [taxonomy repo](https://github.com/shadcn/taxonomy) repo, the following has changed:

1. All routes, including server-rendered pages, include `export const runtime = "edge";` to opt into edge runtime.
2. Auth has moved to Firebase Auth, using `next-firebase-auth-edge` since NextAuth is incompatible with edge runtime.
3. Prisma has been replaced with [Drizzle](https://github.com/drizzle-team/drizzle-orm), which is edge runtime-compatible.
4. PlanetScale uses their serverless driver, to fetch database results over HTTP.
5. Stripe has been modified to use Web Crypto, `constructEventAsync`, and `createFetchHttpClient` to add edge compatibility.
6. Contentlayer has been replaced with `next/mdx` and manually routed pages since next-contentlayer uses incompatible APIs. 
7. Usage of `next/image` has been replaced since it's [currently unsupported by Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#statically-imported-images-on-pages).
8. Use of `vercel/og` is disabled since it's [currently broken](https://github.com/cloudflare/next-on-pages/issues/39) in Next.js on Cloudflare Pages.
9. Use of `EditorJS` is disabled since it seems to import wasm, causing next-on-pages builds to fail. See [this issue](https://github.com/cloudflare/next-on-pages/issues/344) for more details.
10. Yarn: [shadcn/ui](https://github.com/shadcn/ui), the component library for this project, is in a separate package named `components`, while the Next.js app is in another. This repo uses yarn workspaces to link them. 

## Running Locally

1. Install dependencies using pnpm:

```sh
yarn
```

2. Copy `.env.example` to `.env.local` and add your own variables. 

```sh
cp packages/web/.env.example packages/web/.env.local
```

3. Start the development server:

```sh
yarn run web
```

## Deploying on Cloudflare Pages
1. [Push](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#create-a-github-repository) this into a Github repo.
2. Follow [Cloudflare's instructions here](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#3-deploy-your-application-to-cloudflare-pages)
3. Once on the "Set up builds and deployments" step, for configuration options, set:
   1. `Build command` to `yarn && cd packages/web && npx @cloudflare/next-on-pages`
   2. `Build output directory` to `/packages/web/.vercel/output/static`
4. Complete the Cloudflare instructions set above
5. Make sure you set all environment variables, or your build will fail!
   - Don't forget the `NODE_VERSION` env var that the instructions above mention!
   - Note: your `FIREBASE_PRIVATE_KEY` env var should be stripped of all `\n`, `-----BEGIN PRIVATE KEY-----`, and `-----END PRIVATE KEY-----` which are stripped in application code anyway. Cloudflare environment variables do not seem to escape/unescape these properly, at least when entered from the dashboard.

## Managing the DB
In the `./packages/web` directory, you can:
- run `yarn run db:pull` to pull your database's current schema into a local drizzle schema file
- run `yarn run db:migrate-gen` to create a migration based on the state of your `./db/schema.ts` file
- run `yarn run db:migrate-run` to apply any migrations against your database
- - Note: you may need to add `"type": "module",` to `/packages/web/package.json` in some local configuarions to make this work

All operations are run against the database defined in your .env.local environment variables through the planetscale serverless driver. 

## Known Issues/TODO's
- Table of contents in certain MDX pages is disabled for now

## License

Licensed under the [MIT license](https://github.com/shadcn/taxonomy/blob/main/LICENSE.md).
