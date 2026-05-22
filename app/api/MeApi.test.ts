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

import MeApi from "./MeApi";

describe("MeApi", () => {
  beforeEach(() => {
    mocks.callMock.mockReset();
  });

  it("returns user when API call succeeds with data", async () => {
    const user = { name: "Test User" };
    mocks.callMock.mockResolvedValueOnce({
      success: true,
      data: user,
    });

    const result = await MeApi.fetchMe();

    expect(result).toEqual(user);
    expect(mocks.callMock).toHaveBeenCalledWith({
      method: "GET",
      endpoint: "/api/me",
      functionName: "fetchMe",
      customErrorMessage: "Kunne ikke hente brukerdata",
      customSuccessMessage: "Brukerdata hentet",
    });
  });

  it("throws a 500 Response when API response has no user data", async () => {
    mocks.callMock.mockResolvedValueOnce({
      success: false,
      data: null,
    });

    await expect(MeApi.fetchMe()).rejects.toEqual(
      expect.objectContaining({
        status: 500,
        statusText: "Ingen brukerdata funnet, vurder å logge ut og logge inn igjen.",
      }),
    );
  });
});
