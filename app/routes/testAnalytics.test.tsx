import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TestAnalytics, { action } from "./testAnalytics";

const mocks = vi.hoisted(() => ({
  trackButtonClick: vi.fn(),
  trackView: vi.fn(),
  fetchMe: vi.fn(),
}));

vi.mock("@navikt/ds-react", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
  }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock("~/api/AnalyticsApi", () => ({
  default: {
    trackButtonClick: mocks.trackButtonClick,
    trackView: mocks.trackView,
  },
}));

vi.mock("~/api/MeApi", () => ({
  default: { fetchMe: mocks.fetchMe },
}));

describe("testAnalytics route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("tracks button click from component", () => {
    render(<TestAnalytics />);
    fireEvent.click(screen.getByRole("button", { name: "Klikk meg" }));

    expect(mocks.trackButtonClick).toHaveBeenCalled();
  });

  it("action tracks view when actionType is TRACK_VIEW", async () => {
    mocks.fetchMe.mockResolvedValue({ organisation: { name: "Org Name" } });
    const formData = new FormData();
    formData.append("actionType", "TRACK_VIEW");
    formData.append("path", "/testAnalytics");

    const result = await action({
      request: new Request("http://localhost/testAnalytics", { method: "POST", body: formData }),
      params: {},
      context: {},
    } as never);

    expect(mocks.trackView).toHaveBeenCalledWith("/testAnalytics", "Org Name");
    expect(result).toEqual({
      success: true,
      message: "TESTING analytics",
      variant: "warning",
    });
  });
});
