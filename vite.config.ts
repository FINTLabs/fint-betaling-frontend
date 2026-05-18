import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import type { PluginOption } from "vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    !process.env.VITEST ? reactRouter() : null,
    tsconfigPaths(),
  ].filter(Boolean) as PluginOption[],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      all: true,
      include: ["app/**/*.{ts,tsx}"],
      exclude: [
        "**/*.test.*",
        "**/*.spec.*",
        "**/*.d.ts",
        "**/node_modules/**",
      ],
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
