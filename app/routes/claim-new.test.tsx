import { beforeEach, describe, expect, it, vi } from "vitest";
import { action, loader } from "./claim-new";

const mocks = vi.hoisted(() => ({
  parseCookie: vi.fn(),
  fetchMe: vi.fn(),
  getBasisGroups: vi.fn(),
  getTeachingGroups: vi.fn(),
  getSchool: vi.fn(),
  getPrincipals: vi.fn(),
  createClaim: vi.fn(),
}));

vi.mock("~/utils/cookie", () => ({
  selectOrgCookie: { parse: mocks.parseCookie },
}));

vi.mock("~/api/MeApi", () => ({
  default: { fetchMe: mocks.fetchMe },
}));

vi.mock("~/api/SchoolGroupApi", () => ({
  default: {
    getBasisGroups: mocks.getBasisGroups,
    getTeachingGroups: mocks.getTeachingGroups,
    getSchool: mocks.getSchool,
  },
}));

vi.mock("~/api/PrincipalApi", () => ({
  default: { getPrincipals: mocks.getPrincipals },
}));

vi.mock("~/api/ClaimApi", () => ({
  default: { createClaim: mocks.createClaim },
}));

describe("claim-new route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loader fetches selection data for current org", async () => {
    mocks.parseCookie.mockResolvedValue("school.org");
    mocks.fetchMe.mockResolvedValue({ organisationUnits: [{ organisationNumber: "school.org" }] });
    mocks.getBasisGroups.mockResolvedValue({ data: [{ name: "1A" }] });
    mocks.getTeachingGroups.mockResolvedValue({ data: [{ name: "T1" }] });
    mocks.getSchool.mockResolvedValue({ data: { customers: [] } });
    mocks.getPrincipals.mockResolvedValue({ data: { lineitems: [] } });

    const result = await loader({
      request: new Request("http://localhost/claim-new"),
      params: {},
      context: {},
    } as never);

    expect(result.currentSchoolOrgId).toBe("school.org");
    expect(result.schoolGroups).toEqual([{ name: "1A" }]);
    expect(result.teachingGroups).toEqual([{ name: "T1" }]);
  });

  it("action redirects to /send after successful save", async () => {
    const formData = new FormData();
    formData.append("actionType", "SAVE_INVOICES");
    formData.append("selectedOrg", "school.org");
    formData.append("newClaim", '{"x":1}');
    mocks.createClaim.mockResolvedValue({ success: true });

    const response = await action({
      request: new Request("http://localhost/claim-new", { method: "POST", body: formData }),
      params: {},
      context: {},
    } as never);

    expect(response).toBeInstanceOf(Response);
    expect((response as Response).headers.get("Location")).toBe("/send");
  });

  it("action returns error for unknown action", async () => {
    const formData = new FormData();
    formData.append("actionType", "UNKNOWN");
    formData.append("selectedOrg", "school.org");
    formData.append("newClaim", "{}");

    const response = await action({
      request: new Request("http://localhost/claim-new", { method: "POST", body: formData }),
      params: {},
      context: {},
    } as never);

    expect(response).toEqual({
      success: false,
      message: "Ukjent handlingstype: 'UNKNOWN'",
      variant: "error",
    });
  });
});
