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

import SchoolGroupApi from "./SchoolGroupApi";

describe("SchoolGroupApi", () => {
  beforeEach(() => {
    mocks.callMock.mockReset();
  });

  it("builds getBasisGroups request", async () => {
    mocks.callMock.mockResolvedValueOnce({ ok: true });

    await SchoolGroupApi.getBasisGroups("school.org");

    expect(mocks.callMock).toHaveBeenCalledWith({
      method: "GET",
      endpoint: "/api/group/basis-group",
      functionName: "getSchoolGroups",
      customErrorMessage: "Kunne ikke hente school groups.",
      customSuccessMessage: "School groups hentet.",
      additionalHeaders: {
        "x-school-org-id": "school.org",
      },
    });
  });

  it("builds getTeachingGroups request", async () => {
    mocks.callMock.mockResolvedValueOnce({ ok: true });

    await SchoolGroupApi.getTeachingGroups("school.org");

    expect(mocks.callMock).toHaveBeenCalledWith({
      method: "GET",
      endpoint: "/api/group/teaching-group",
      functionName: "getSchoolGroups",
      customErrorMessage: "Kunne ikke hente teaching groups.",
      customSuccessMessage: "Teaching groups hentet.",
      additionalHeaders: {
        "x-school-org-id": "school.org",
      },
    });
  });

  it("builds getSchool request", async () => {
    mocks.callMock.mockResolvedValueOnce({ ok: true });

    await SchoolGroupApi.getSchool("school.org");

    expect(mocks.callMock).toHaveBeenCalledWith({
      method: "GET",
      endpoint: "/api/group/school",
      functionName: "getSchoolGroups",
      customErrorMessage: "Kunne ikke hente schools.",
      customSuccessMessage: "School groups hentet.",
      additionalHeaders: {
        "x-school-org-id": "school.org",
      },
    });
  });
});
