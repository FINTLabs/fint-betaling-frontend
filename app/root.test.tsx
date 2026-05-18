import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { action, ErrorBoundary, loader } from "./root";

const mocks = vi.hoisted(() => ({
  parseCookie: vi.fn(),
  serializeCookie: vi.fn(),
  fetchMe: vi.fn(),
  setSchoolOrgId: vi.fn(),
  getSchoolOrgId: vi.fn(),
  trackError: vi.fn(),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    useLocation: () => ({ pathname: "/error" }),
  };
});

vi.mock("~/utils/cookie", () => ({
  selectOrgCookie: {
    parse: mocks.parseCookie,
    serialize: mocks.serializeCookie,
  },
}));

vi.mock("~/api/MeApi", () => ({
  default: { fetchMe: mocks.fetchMe },
}));

vi.mock("~/utils/headerProperties", () => ({
  HeaderProperties: {
    setSchoolOrgId: mocks.setSchoolOrgId,
    getSchoolOrgId: mocks.getSchoolOrgId,
  },
}));

vi.mock("~/api/AnalyticsApi", () => ({
  default: { trackError: mocks.trackError },
}));

vi.mock("~/components/CustomErrorLayout", () => ({
  CustomErrorLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("~/components/CustomError", () => ({
  default: ({
    errorData,
    statusTitle,
  }: {
    errorData?: string;
    statusTitle?: string;
  }) => (
    <div>
      <span>{statusTitle}</span>
      <span>{errorData}</span>
    </div>
  ),
}));

vi.mock("../cypress/mocks/browser", () => ({
  worker: { start: vi.fn() },
}));

vi.mock("../cypress/mocks/server", () => ({
  server: { listen: vi.fn() },
}));

describe("root route module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getSchoolOrgId.mockReturnValue("school-1");
  });

  it("loader uses cookie org when valid and does not set cookie", async () => {
    mocks.parseCookie.mockResolvedValue("school-1");
    mocks.fetchMe.mockResolvedValue({
      organisationUnits: [
        { organisationNumber: "school-1", name: "School 1" },
        { organisationNumber: "school-2", name: "School 2" },
      ],
    });

    const result = await loader({
      request: new Request("http://localhost/"),
      params: {},
      context: {},
    } as never);

    expect(result.selectedOrganization.organisationNumber).toBe("school-1");
    expect(mocks.serializeCookie).not.toHaveBeenCalled();
    expect(mocks.setSchoolOrgId).toHaveBeenCalledWith("school-1");
  });

  it("loader falls back to first org and serializes cookie when missing", async () => {
    mocks.parseCookie.mockResolvedValue(null);
    mocks.serializeCookie.mockResolvedValue("selectedOrg=school-1");
    mocks.fetchMe.mockResolvedValue({
      organisationUnits: [{ organisationNumber: "school-1", name: "School 1" }],
    });

    const result = await loader({
      request: new Request("http://localhost/"),
      params: {},
      context: {},
    } as never);

    expect(mocks.serializeCookie).toHaveBeenCalledWith("school-1");
    expect((result as { data: { selectedOrganization: { organisationNumber: string } } }).data.selectedOrganization.organisationNumber).toBe(
      "school-1",
    );
  });

  it("action updates cookie when updating selected organization", async () => {
    mocks.serializeCookie.mockResolvedValue("selectedOrg=school-2");
    const formData = new FormData();
    formData.append("actionType", "UPDATE_SELECTED_ORGANIZATION");
    formData.append("selectedOrganization", "school-2");

    const result = await action({
      request: new Request("http://localhost/", { method: "POST", body: formData }),
      params: {},
      context: {},
    } as never);

    expect(mocks.serializeCookie).toHaveBeenCalledWith("school-2");
    expect((result as { data: { revalidate: boolean } }).data.revalidate).toBe(
      true,
    );
  });

  it("error boundary tracks unexpected errors", () => {
    render(<ErrorBoundary error={new Error("boom")} />);

    expect(screen.getByText("Noe gikk galt")).toBeTruthy();
    expect(screen.getByText("boom")).toBeTruthy();
    expect(mocks.trackError).toHaveBeenCalledWith({
      path: "/error",
      message: "boom",
      statusCode: 500,
    });
  });
});
