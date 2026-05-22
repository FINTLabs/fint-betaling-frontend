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

describe("PrincipalApi", () => {
  beforeEach(() => {
    mocks.callMock.mockReset();
  });

  it("builds getPrincipals request", async () => {
    mocks.callMock.mockResolvedValueOnce({ ok: true });

    await PrincipalApi.getPrincipals("school.org");

    expect(mocks.callMock).toHaveBeenCalledWith({
      method: "GET",
      endpoint: "/api/principal",
      functionName: "getPrincipals",
      customErrorMessage: "Kunne ikke hente principals.",
      customSuccessMessage: "Principals hentet.",
      additionalHeaders: {
        "x-school-org-id": "school.org",
      },
    });
  });
});
