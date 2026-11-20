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

import PrincipalApi from "./PrincipalApi";

const request = new Request("https://example.test/", {
  headers: { Cookie: "session=test-session" },
});

describe("PrincipalApi", () => {
  beforeEach(() => {
    mocks.callMock.mockReset();
  });

  it("builds getPrincipals request", async () => {
    mocks.callMock.mockResolvedValueOnce({ ok: true });

    await PrincipalApi.getPrincipals(request, "school.org");

    expect(mocks.callMock).toHaveBeenCalledWith({
      method: "GET",
      endpoint: "/api/principal",
      functionName: "getPrincipals",
      customErrorMessage: "Kunne ikke hente principals.",
      customSuccessMessage: "Principals hentet.",
      additionalHeaders: {
        Cookie: "session=test-session",
        "x-school-org-id": "school.org",
      },
    });
  });
});
