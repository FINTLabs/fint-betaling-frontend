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

    const request = new Request("https://example.test/", {
      headers: { Cookie: "session=test-session" },
    });

    const result = await MeApi.fetchMe(request);

    expect(result).toEqual(user);
    expect(mocks.callMock).toHaveBeenCalledWith({
      method: "GET",
      endpoint: "/api/me",
      additionalHeaders: { Cookie: "session=test-session" },
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

    await expect(MeApi.fetchMe(new Request("https://example.test/"))).rejects.toEqual(
      expect.objectContaining({
        status: 500,
        statusText: "Ingen brukerdata funnet, vurder å logge ut og logge inn igjen.",
      }),
    );
  });
});
