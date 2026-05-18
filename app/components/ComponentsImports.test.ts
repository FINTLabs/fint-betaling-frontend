import { describe, expect, it } from "vitest";

const componentModules = import.meta.glob("./**/*.tsx");
const IMPORT_TIMEOUT_MS = 30_000;

describe("components modules", () => {
  for (const [path, loadModule] of Object.entries(componentModules)) {
    if (path.endsWith(".test.tsx") || path.endsWith(".test.ts")) {
      continue;
    }

    it(
      `imports ${path}`,
      async () => {
      const module = await loadModule();
      expect(module).toBeTruthy();
      },
      IMPORT_TIMEOUT_MS,
    );
  }
});
