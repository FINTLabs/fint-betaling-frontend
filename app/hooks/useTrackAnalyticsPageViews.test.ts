import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useTrackAnalyticsPageViews } from "./useTrackAnalyticsPageViews";

const mocks = vi.hoisted(() => ({
  trackEvent: vi.fn(),
  trackSearch: vi.fn(),
}));

let mockLocation = {
  pathname: "/home",
  search: "",
};

vi.mock("react-router", () => ({
  useLocation: () => mockLocation,
}));

vi.mock("~/api/AnalyticsApi", () => ({
  default: {
    trackEvent: mocks.trackEvent,
    trackSearch: mocks.trackSearch,
  },
}));

describe("useTrackAnalyticsPageViews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation = { pathname: "/home", search: "" };
  });

  it("tracks page views on initial render", () => {
    renderHook(() => useTrackAnalyticsPageViews("tenant-1"));

    expect(mocks.trackEvent).toHaveBeenCalledWith({
      type: "page_view",
      path: "/home",
      tenant: "tenant-1",
    });
    expect(mocks.trackSearch).not.toHaveBeenCalled();
  });

  it("tracks search metadata when query params exist", () => {
    mockLocation = { pathname: "/history", search: "?status=STORED&period=WEEK" };

    renderHook(() => useTrackAnalyticsPageViews("tenant-2"));

    expect(mocks.trackEvent).toHaveBeenCalledWith({
      type: "page_view",
      path: "/history",
      tenant: "tenant-2",
    });
    expect(mocks.trackSearch).toHaveBeenCalledWith(
      "/history",
      { status: "STORED", period: "WEEK" },
      "tenant-2",
    );
  });

  it("does not re-send analytics for the same path and query", () => {
    const { rerender } = renderHook(
      ({ tenant }) => useTrackAnalyticsPageViews(tenant),
      { initialProps: { tenant: "tenant-1" } },
    );

    rerender({ tenant: "tenant-1" });

    expect(mocks.trackEvent).toHaveBeenCalledTimes(1);
    expect(mocks.trackSearch).toHaveBeenCalledTimes(0);
  });

  it("sends new events when route changes", () => {
    const { rerender } = renderHook(() => useTrackAnalyticsPageViews());

    mockLocation = { pathname: "/pending", search: "?q=123" };
    rerender();

    expect(mocks.trackEvent).toHaveBeenNthCalledWith(2, {
      type: "page_view",
      path: "/pending",
    });
    expect(mocks.trackSearch).toHaveBeenCalledWith(
      "/pending",
      { q: "123" },
      undefined,
    );
  });
});
