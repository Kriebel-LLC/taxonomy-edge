interface CloudflareEnv {
  // Add the Cloudflare Bindings & their types in packages/web/wrangler.toml
  // (for more details on Bindings see: https://developers.cloudflare.com/pages/functions/bindings/)
  DB: D1Database;
}
