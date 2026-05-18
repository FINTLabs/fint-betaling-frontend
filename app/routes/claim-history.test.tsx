import { beforeEach, describe, expect, it, vi } from "vitest";
import { action, loader } from "./claim-history";

const mocks = vi.hoisted(() => ({
  parseCookie: vi.fn(),
  fetchMe: vi.fn(),
  getClaims: vi.fn(),
  sendClaimsToSystem: vi.fn(),
}));

vi.mock("~/utils/cookie", () => ({
  selectOrgCookie: { parse: mocks.parseCookie },
}));

vi.mock("~/api/MeApi", () => ({
  default: { fetchMe: mocks.fetchMe },
}));

vi.mock("~/api/ClaimApi", () => ({
  default: {
    getClaims: mocks.getClaims,
    sendClaimsToSystem: mocks.sendClaimsToSystem,
  },
}));

describe("claim-history route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loader reads query params and returns claim history", async () => {
    mocks.parseCookie.mockResolvedValue("school.org");
    mocks.fetchMe.mockResolvedValue({ organisationUnits: [{ organisationNumber: "school.org" }] });
    mocks.getClaims.mockResolvedValue({ success: true, data: [{ orderNumber: 1 }] });

    const result = await loader({
      request: new Request(
        "http://localhost/claim-history?periodSelection=MONTH&schoolSelection=123&status=STORED",
      ),
      params: {},
      context: {},
    } as never);

    expect(mocks.getClaims).toHaveBeenCalledWith(
      "school.org",
      "STORED",
      "MONTH",
      "123",
    );
    expect(result.claimHistory).toEqual([{ orderNumber: 1 }]);
    expect(result.periodSelection).toBe("MONTH");
  });

  it("action handles DOWNLOAD_SELECTED", async () => {
    const formData = new FormData();
    formData.append("actionType", "DOWNLOAD_SELECTED");
    formData.append("selectedClaims", JSON.stringify(["1", "2"]));
    mocks.parseCookie.mockResolvedValue("school.org");
    mocks.fetchMe.mockResolvedValue({ organisationUnits: [{ organisationNumber: "school.org" }] });

    const result = await action({
      request: new Request("http://localhost/claim-history", { method: "POST", body: formData }),
      params: {},
      context: {},
    } as never);

    expect(result).toEqual({
      success: true,
      message: "2 ordre slettet",
      variant: "success",
    });
  });

  it("action sends selected claims to factoring", async () => {
    const formData = new FormData();
    formData.append("actionType", "SEND_TO_FACTORING");
    formData.append("selectedClaims", JSON.stringify(["1"]));
    mocks.parseCookie.mockResolvedValue("school.org");
    mocks.fetchMe.mockResolvedValue({ organisationUnits: [{ organisationNumber: "school.org" }] });
    mocks.sendClaimsToSystem.mockResolvedValue({ success: true });

    await action({
      request: new Request("http://localhost/claim-history", { method: "POST", body: formData }),
      params: {},
      context: {},
    } as never);

    expect(mocks.sendClaimsToSystem).toHaveBeenCalledWith("school.org", '["1"]');
  });
});
