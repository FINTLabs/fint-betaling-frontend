import { describe, expect, it, vi, beforeEach } from "vitest";
import { action } from "./api.events";

describe("api.events action", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 405 for non-POST requests", async () => {
    const response = await action({
      request: new Request("http://localhost/api/events", { method: "GET" }),
      params: {},
      context: {},
    } as never);

    expect(response.status).toBe(405);
  });

  it("forwards POST body and returns upstream response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response('{"ok":true}', {
        status: 201,
        headers: { "content-type": "application/json" },
      }),
    );

    const response = await action({
      request: new Request("http://localhost/api/events", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-analytics-token": "token-1",
        },
        body: '{"type":"page_view"}',
      }),
      params: {},
      context: {},
    } as never);

    expect(globalThis.fetch).toHaveBeenCalled();
    expect(response.status).toBe(201);
    await expect(response.text()).resolves.toBe('{"ok":true}');
  });
});
