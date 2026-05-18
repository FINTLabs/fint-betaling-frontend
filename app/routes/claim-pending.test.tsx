import { beforeEach, describe, expect, it, vi } from "vitest";
import { action, loader } from "./claim-pending";

const mocks = vi.hoisted(() => ({
  parseCookie: vi.fn(),
  fetchMe: vi.fn(),
  getClaims: vi.fn(),
  cancelClaim: vi.fn(),
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
    cancelClaim: mocks.cancelClaim,
    sendClaimsToSystem: mocks.sendClaimsToSystem,
  },
}));

describe("claim-pending route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loader returns pending claims for STORED status", async () => {
    mocks.parseCookie.mockResolvedValue("school.org");
    mocks.fetchMe.mockResolvedValue({ organisationUnits: [{ organisationNumber: "school.org" }] });
    mocks.getClaims.mockResolvedValue({ success: true, data: [{ orderNumber: 10 }] });

    const result = await loader({
      request: new Request("http://localhost/claim-pending"),
      params: {},
      context: {},
    } as never);

    expect(mocks.getClaims).toHaveBeenCalledWith("school.org", "STORED");
    expect(result.pendingClaims).toEqual([{ orderNumber: 10 }]);
  });

  it("action deletes selected claims and returns success", async () => {
    const formData = new FormData();
    formData.append("actionType", "DELETE_CLAIMS");
    formData.append("selectedClaims", JSON.stringify(["1", "2"]));
    mocks.parseCookie.mockResolvedValue("school.org");
    mocks.fetchMe.mockResolvedValue({ organisationUnits: [{ organisationNumber: "school.org" }] });
    mocks.cancelClaim.mockResolvedValue({ success: true });

    const result = await action({
      request: new Request("http://localhost/claim-pending", { method: "POST", body: formData }),
      params: {},
      context: {},
    } as never);

    expect(mocks.cancelClaim).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      success: true,
      message: "2 ordre slettet",
      variant: "success",
    });
  });

  it("action reports failures when delete has errors", async () => {
    const formData = new FormData();
    formData.append("actionType", "DELETE_CLAIMS");
    formData.append("selectedClaims", JSON.stringify(["1", "2"]));
    mocks.parseCookie.mockResolvedValue("school.org");
    mocks.fetchMe.mockResolvedValue({ organisationUnits: [{ organisationNumber: "school.org" }] });
    mocks.cancelClaim
      .mockResolvedValueOnce({ success: true })
      .mockResolvedValueOnce({ success: false });

    const result = await action({
      request: new Request("http://localhost/claim-pending", { method: "POST", body: formData }),
      params: {},
      context: {},
    } as never);

    expect(result).toEqual({
      success: false,
      message: "1 ordre ikke slettet",
      variant: "error",
    });
  });
});
