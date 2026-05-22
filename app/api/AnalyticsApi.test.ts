import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const callMock = vi.fn();
  const managerCtorMock = vi.fn(function NovariApiManagerMock() {
    return { call: callMock };
  });
  return { callMock, managerCtorMock };
});

vi.mock("novari-frontend-components", () => ({
  NovariApiManager: mocks.managerCtorMock,
}));

import AnalyticsApi from "./AnalyticsApi";

describe("AnalyticsApi", () => {
  beforeEach(() => {
    mocks.callMock.mockReset();
  });

  it("builds trackEvent request", async () => {
    mocks.callMock.mockResolvedValueOnce({ ok: true });

    await AnalyticsApi.trackEvent({
      type: "button_click",
      path: "/claim-history",
      element: "send-button",
      tenant: "school.org",
      meta: { section: "history" },
    });

    expect(mocks.callMock).toHaveBeenCalledWith({
      method: "POST",
      endpoint: "/_analytics/events",
      functionName: "trackEvent",
      body: {
        app: "betaling",
        type: "button_click",
        path: "/claim-history",
        element: "send-button",
        tenant: "school.org",
        meta: { section: "history" },
      },
      additionalHeaders: {
        "x-analytics-token": "change-me",
      },
    });
  });

  it("trackView delegates with page_view payload", async () => {
    const spy = vi.spyOn(AnalyticsApi, "trackEvent").mockResolvedValueOnce({ ok: true } as never);

    await AnalyticsApi.trackView("/home", "school.org");

    expect(spy).toHaveBeenCalledWith({
      type: "page_view",
      path: "/home",
      tenant: "school.org",
    });
  });

  it("trackButtonClick delegates with button_click payload", async () => {
    const spy = vi
      .spyOn(AnalyticsApi, "trackEvent")
      .mockResolvedValueOnce({ ok: true } as never);

    await AnalyticsApi.trackButtonClick("save", "/claim-new", "school.org");

    expect(spy).toHaveBeenCalledWith({
      type: "button_click",
      path: "/claim-new",
      element: "save",
      tenant: "school.org",
    });
  });

  it("trackSearch delegates with search payload", async () => {
    const spy = vi.spyOn(AnalyticsApi, "trackEvent").mockResolvedValueOnce({ ok: true } as never);

    await AnalyticsApi.trackSearch("/claim-history", { query: "123" }, "school.org");

    expect(spy).toHaveBeenCalledWith({
      type: "search",
      path: "/claim-history",
      tenant: "school.org",
      meta: { query: "123" },
    });
  });

  it("trackError delegates with normalized error meta", async () => {
    const spy = vi.spyOn(AnalyticsApi, "trackEvent").mockResolvedValueOnce({ ok: true } as never);

    await AnalyticsApi.trackError({ path: "/claim-new", message: "boom", statusCode: 500 });

    expect(spy).toHaveBeenCalledWith({
      type: "error",
      path: "/claim-new",
      meta: {
        message: "boom",
        statusCode: 500,
      },
    });
  });
});
