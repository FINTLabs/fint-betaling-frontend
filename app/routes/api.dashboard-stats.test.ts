import { describe, expect, it, vi, beforeEach } from "vitest";
import { loader } from "./api.dashboard-stats";

const mocks = vi.hoisted(() => ({
  parseCookie: vi.fn(),
  fetchMe: vi.fn(),
  getCountByStatus: vi.fn(),
}));

vi.mock("~/utils/cookie", () => ({
  selectOrgCookie: { parse: mocks.parseCookie },
}));

vi.mock("~/api/MeApi", () => ({
  default: { fetchMe: mocks.fetchMe },
}));

vi.mock("~/api/ClaimApi", () => ({
  default: {
    getCountByStatus: mocks.getCountByStatus,
  },
}));

describe("dashboard stats loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("aggregates successful counts", async () => {
    mocks.parseCookie.mockResolvedValue("school.org");
    mocks.fetchMe.mockResolvedValue({
      organisationUnits: [
        { organisationNumber: "other.org" },
        { organisationNumber: "school.org" },
      ],
    });
    mocks.getCountByStatus
      .mockResolvedValueOnce({ success: true, data: 3 })
      .mockResolvedValueOnce({ success: true, data: 1 })
      .mockResolvedValueOnce({ success: true, data: 2 })
      .mockResolvedValueOnce({ success: false, data: 99 })
      .mockResolvedValueOnce({ success: true, data: 4 });
    const result = await loader({
      request: new Request("http://localhost/home"),
      params: {},
      context: {},
    } as never);

    expect(result.stats).toEqual({
      pendingOrders: 3,
      errorOrders: 7,
    });
    expect(mocks.getCountByStatus).toHaveBeenCalledWith("school.org", "STORED");
  });

  it("throws 400 when no organisation can be resolved", async () => {
    mocks.parseCookie.mockResolvedValue(null);
    mocks.fetchMe.mockResolvedValue({ organisationUnits: [] });

    await expect(
      loader({
        request: new Request("http://localhost/home"),
        params: {},
        context: {},
      } as never),
    ).rejects.toMatchObject({ status: 400 });
  });
});
