import { afterEach, describe, expect, it, vi } from "vitest";
import { loader } from "./api.dashboard-batches";

const mocks = vi.hoisted(() => ({
  getClaims: vi.fn(),
  getOrganizationNumber: vi.fn().mockResolvedValue("school.org"),
}));

vi.mock("~/api/ClaimApi", () => ({
  default: { getClaims: mocks.getClaims },
}));

vi.mock("~/utils/dashboardOrganization.server", () => ({
  getDashboardOrganizationNumber: mocks.getOrganizationNumber,
}));

const args = {
  request: new Request("http://localhost/_dashboard/batches"),
  params: {},
  context: {},
} as Parameters<typeof loader>[0];

describe("dashboard batch history loader", () => {
  afterEach(() => vi.useRealTimers());

  it("counts only PAID orders from the past year before limiting batch history", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2025-01-01T12:00:00Z"));
    const latest = "2024-01-15T10:00:00Z";
    mocks.getClaims.mockResolvedValueOnce({
      success: true,
      data: [
        { createdDate: "2023-12-31T23:59:59", claimStatus: "PAID" },
        ...Array.from({ length: 14 }, (_, index) => ({
          createdDate: `2024-01-${String(index + 1).padStart(2, "0")}T10:00:00Z`,
          claimStatus: index === 0 ? "PAID" : "SENT",
        })),
        ...["PAID", "CREDITED", "UPDATE_ERROR", "STORED", "CANCELLED"].map(
          (claimStatus) => ({ createdDate: latest, claimStatus }),
        ),
      ],
    });

    const { batches, paidOrders } = await loader(args);

    expect(mocks.getClaims).toHaveBeenCalledWith("school.org");
    expect(paidOrders).toBe(2);
    expect(batches).toHaveLength(14);
    expect(batches?.[0]).toEqual({
      date: latest,
      totalRecords: 5,
      sent: 2,
      errors: 1,
      stored: 1,
      cancelled: 1,
    });
    expect(batches?.at(-1)?.date).toBe("2024-01-02T10:00:00Z");
  });

  it("distinguishes a failed request from empty history", async () => {
    mocks.getClaims
      .mockResolvedValueOnce({ success: false })
      .mockResolvedValueOnce({ success: true, data: [] });

    await expect(loader(args)).resolves.toEqual({ batches: null, paidOrders: null });
    await expect(loader(args)).resolves.toEqual({ batches: [], paidOrders: 0 });
  });
});
