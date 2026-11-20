import type { Config } from "@react-router/dev/config";

// BASE_PATH is injected at build time (see Dockerfile / CD) so each org image
// is served under its own sub-path. Keep the trailing slash for root links.
const rawBasePath = process.env.BASE_PATH?.trim() ?? "/";
const normalizedBasePath = rawBasePath.replace(/^\/+|\/+$/g, "");
const basename = normalizedBasePath ? `/${normalizedBasePath}/` : "/";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  basename,
} satisfies Config;
