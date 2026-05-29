import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import type { PluginOption } from "vite";
import { defineConfig } from "vitest/config";

// BASE_PATH is injected at build time so static assets are emitted under the
// org's sub-path (e.g. /afk/assets/...). Must keep a trailing slash for Vite.
const rawBasePath = process.env.BASE_PATH ?? "/";
const base =
  rawBasePath === "/" ? "/" : `/${rawBasePath.replace(/^\/+|\/+$/g, "")}/`;

export default defineConfig({
  base,
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    !process.env.VITEST ? reactRouter() : null,
  ].filter(Boolean) as PluginOption[],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["app/**/*.{ts,tsx}"],
      exclude: [
        "**/*.test.*",
        "**/*.spec.*",
        "**/*.d.ts",
        "**/node_modules/**",
        "app/types/**",
        "app/routes.ts",
        "app/utils/cookie.ts",
        "app/utils/csp.ts",
        "app/utils/headerProperties.ts",
      ],
      thresholds: {
        lines: 70,
        statements: 70,
        functions: 70,
        branches: 60,
      },
    },
  },
  server: {
    port: 3001,
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 3001,
    },
  },
});
