/// <reference path="../.astro/types.d.ts" />
type KVNamespace = import("@cloudflare/workers-types").KVNamespace;
type ENV = {
  // replace `MY_KV` with your KV namespace
  MY_KV: KVNamespace;
};

// use a default runtime configuration (advanced mode).
type Runtime = import("@astrojs/cloudflare").Runtime<ENV>;
declare namespace App {
  interface Locals extends Runtime {}
}

interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_KEY: string;
  readonly CLOUDFLARE_URL: string;
  readonly CLOUDFLARE_ACCESS_ID: string;
  readonly CLOUDFLARE_ACCESS_KEY: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
