import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const managerCtorMock = vi.fn(function NovariApiManagerMock(opts: { baseUrl: string }) {
    return { baseUrl: opts.baseUrl };
  });
  return { managerCtorMock };
});

vi.mock("novari-frontend-components", () => ({
  NovariApiManager: mocks.managerCtorMock,
}));

describe("apiBaseUrl", () => {
  beforeEach(() => {
    vi.resetModules();
    mocks.managerCtorMock.mockClear();
  });

  afterEach(() => {
    delete process.env.VITE_API_URL;
  });

  it("uses env-configured base URL and does not override it with request origin", async () => {
    process.env.VITE_API_URL = "https://env-configured.example.com";

    const { setApiBaseUrlFromRequest, createApiManager } = await import("./apiBaseUrl");

    setApiBaseUrlFromRequest(new Request("https://request-origin.example.com/some/path"));

    createApiManager();

    expect(mocks.managerCtorMock).toHaveBeenCalledWith(
      expect.objectContaining({ baseUrl: "https://env-configured.example.com" }),
    );
  });

  it("derives base URL from request origin when env is empty", async () => {
    process.env.VITE_API_URL = "";

    const { setApiBaseUrlFromRequest, createApiManager } = await import("./apiBaseUrl");

    setApiBaseUrlFromRequest(new Request("https://request-origin.example.com/some/path"));

    createApiManager();

    expect(mocks.managerCtorMock).toHaveBeenCalledWith(
      expect.objectContaining({ baseUrl: "https://request-origin.example.com" }),
    );
  });

  it("falls back to empty string when request URL is invalid", async () => {
    process.env.VITE_API_URL = "";

    const { setApiBaseUrlFromRequest, createApiManager } = await import("./apiBaseUrl");

    setApiBaseUrlFromRequest({ url: "not-a-valid-url" } as unknown as Request);

    createApiManager();

    expect(mocks.managerCtorMock).toHaveBeenCalledWith(
      expect.objectContaining({ baseUrl: "" }),
    );
  });
});
