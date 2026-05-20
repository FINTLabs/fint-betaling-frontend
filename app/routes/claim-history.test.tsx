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

const MIN_USER = (orgId: string) => ({
  name: "Tester",
  employeeNumber: "1",
  organisation: { organisationNumber: orgId, name: "Org" },
  organisationUnits: [{ organisationNumber: orgId, name: "School" }],
  idleTime: 0,
  admin: false,
});

describe("claim-history route loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reads query params and returns claim history", async () => {
    mocks.parseCookie.mockResolvedValue("school.org");
    mocks.fetchMe.mockResolvedValue(MIN_USER("school.org"));
    mocks.getClaims.mockResolvedValue({ success: true, data: [{ orderNumber: 1 }] });

    const result = await loader({
      request: new Request(
        "http://localhost/historikk?periodSelection=MONTH&schoolSelection=123&status=STORED",
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
    expect(result.statusSelection).toBe("STORED");
    expect(result.schoolSelection).toBe("123");
  });

  it("defaults period to WEEK and status to empty when query missing", async () => {
    mocks.parseCookie.mockResolvedValue("school.org");
    mocks.fetchMe.mockResolvedValue(MIN_USER("school.org"));
    mocks.getClaims.mockResolvedValue({ success: true, data: [] });

    await loader({
      request: new Request("http://localhost/historikk"),
      params: {},
      context: {},
    } as never);

    expect(mocks.getClaims).toHaveBeenCalledWith(
      "school.org",
      "",
      "WEEK",
      "school.org",
    );
  });

  it("resolves organisation from MeApi when cookie is missing", async () => {
    mocks.parseCookie.mockResolvedValue(undefined);
    mocks.fetchMe.mockResolvedValue(MIN_USER("fallback-org"));
    mocks.getClaims.mockResolvedValue({ success: true, data: [] });

    await loader({
      request: new Request("http://localhost/historikk"),
      params: {},
      context: {},
    } as never);

    expect(mocks.getClaims).toHaveBeenCalledWith(
      "fallback-org",
      "",
      "WEEK",
      "fallback-org",
    );
  });

  it("returns empty claims and does not call API when user has no organisation", async () => {
    mocks.parseCookie.mockResolvedValue(null);
    mocks.fetchMe.mockResolvedValue({
      ...MIN_USER("x"),
      organisationUnits: [],
    });

    const result = await loader({
      request: new Request("http://localhost/historikk"),
      params: {},
      context: {},
    } as never);

    expect(mocks.getClaims).not.toHaveBeenCalled();
    expect(result.claimHistory).toEqual([]);
    expect(result.periodSelection).toBe("WEEK");
    expect(result.statusSelection).toBe("");
    expect(result.schoolSelection).toBe("");
  });

  it("returns empty list when ClaimApi reports failure", async () => {
    mocks.parseCookie.mockResolvedValue("school.org");
    mocks.fetchMe.mockResolvedValue(MIN_USER("school.org"));
    mocks.getClaims.mockResolvedValue({
      success: false,
      data: [{ orderNumber: 99 }] as unknown as never[],
    });

    const result = await loader({
      request: new Request("http://localhost/historikk"),
      params: {},
      context: {},
    } as never);

    expect(result.claimHistory).toEqual([]);
  });

  it("treats missing data array as empty when success", async () => {
    mocks.parseCookie.mockResolvedValue("school.org");
    mocks.fetchMe.mockResolvedValue(MIN_USER("school.org"));
    mocks.getClaims.mockResolvedValue({ success: true, data: undefined });

    const result = await loader({
      request: new Request("http://localhost/historikk"),
      params: {},
      context: {},
    } as never);

    expect(result.claimHistory).toEqual([]);
  });
});

describe("claim-history route action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handles DOWNLOAD_SELECTED", async () => {
    const formData = new FormData();
    formData.append("actionType", "DOWNLOAD_SELECTED");
    formData.append("selectedClaims", JSON.stringify(["1", "2"]));
    mocks.parseCookie.mockResolvedValue("school.org");
    mocks.fetchMe.mockResolvedValue(MIN_USER("school.org"));

    const result = await action({
      request: new Request("http://localhost/historikk", {
        method: "POST",
        body: formData,
      }),
      params: {},
      context: {},
    } as never);

    expect(result).toEqual({
      success: true,
      message: "2 ordre slettet",
      variant: "success",
    });
  });

  it("DOWNLOAD_SELECTED with empty selection builds zero message", async () => {
    const formData = new FormData();
    formData.append("actionType", "DOWNLOAD_SELECTED");
    formData.append("selectedClaims", JSON.stringify([]));
    mocks.parseCookie.mockResolvedValue("school.org");
    mocks.fetchMe.mockResolvedValue(MIN_USER("school.org"));

    const result = await action({
      request: new Request("http://localhost/historikk", {
        method: "POST",
        body: formData,
      }),
      params: {},
      context: {},
    } as never);

    expect(result).toEqual({
      success: true,
      message: "0 ordre slettet",
      variant: "success",
    });
  });

  it("sends selected claims to factoring", async () => {
    const formData = new FormData();
    formData.append("actionType", "SEND_TO_FACTORING");
    formData.append("selectedClaims", JSON.stringify(["1"]));
    mocks.parseCookie.mockResolvedValue("school.org");
    mocks.fetchMe.mockResolvedValue(MIN_USER("school.org"));
    mocks.sendClaimsToSystem.mockResolvedValue({ success: true });

    const result = await action({
      request: new Request("http://localhost/historikk", {
        method: "POST",
        body: formData,
      }),
      params: {},
      context: {},
    } as never);

    expect(mocks.sendClaimsToSystem).toHaveBeenCalledWith("school.org", '["1"]');
    expect(result).toEqual({ success: true });
  });

  it("returns error when organisation cannot be resolved", async () => {
    const formData = new FormData();
    formData.append("actionType", "DOWNLOAD_SELECTED");
    formData.append("selectedClaims", JSON.stringify(["1"]));
    mocks.parseCookie.mockResolvedValue(null);
    mocks.fetchMe.mockResolvedValue({
      ...MIN_USER("ignored"),
      organisationUnits: [],
    });

    const result = await action({
      request: new Request("http://localhost/historikk", {
        method: "POST",
        body: formData,
      }),
      params: {},
      context: {},
    } as never);

    expect(result).toEqual({
      success: false,
      message: "Ingen organisasjon valgt",
      variant: "error",
    });
    expect(mocks.sendClaimsToSystem).not.toHaveBeenCalled();
  });

  it("returns error for unknown action type", async () => {
    const formData = new FormData();
    formData.append("actionType", "MYSTERY_ACTION");
    formData.append("selectedClaims", JSON.stringify(["1"]));
    mocks.parseCookie.mockResolvedValue("school.org");
    mocks.fetchMe.mockResolvedValue(MIN_USER("school.org"));

    const result = await action({
      request: new Request("http://localhost/historikk", {
        method: "POST",
        body: formData,
      }),
      params: {},
      context: {},
    } as never);

    expect(result).toEqual({
      success: false,
      message: "Ukjent handlingstype: 'MYSTERY_ACTION'",
      variant: "error",
    });
  });

  it("does not call sendClaimsToSystem when organisation missing for SEND_TO_FACTORING", async () => {
    const formData = new FormData();
    formData.append("actionType", "SEND_TO_FACTORING");
    formData.append("selectedClaims", JSON.stringify(["9"]));
    mocks.parseCookie.mockResolvedValue(undefined);
    mocks.fetchMe.mockResolvedValue({
      ...MIN_USER("x"),
      organisationUnits: [],
    });

    const result = await action({
      request: new Request("http://localhost/historikk", {
        method: "POST",
        body: formData,
      }),
      params: {},
      context: {},
    } as never);

    expect(mocks.sendClaimsToSystem).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      success: false,
      variant: "error",
    });
  });
});
