import { describe, expect, it, vi, beforeEach } from "vitest";
import { loader } from "./home";

const mocks = vi.hoisted(() => ({
  parseCookie: vi.fn(),
  fetchMe: vi.fn(),
  getCountByStatus: vi.fn(),
  getClaims: vi.fn(),
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
    getClaims: mocks.getClaims,
  },
}));

const makeClaim = (createdDate: string, claimStatus: string) =>
  ({
    orderNumber: Math.floor(Math.random() * 10000),
    createdDate,
    claimStatus,
    orgId: "org",
    invoiceDate: null,
    paymentDueDate: null,
    amountDue: 1000,
    originalAmountDue: 1000,
    requestedNumberOfDaysToPaymentDeadline: null,
    customerName: "A",
    createdByEmployee: "B",
    organisationUnit: { organisationNumber: "1", name: "School" },
    principalCode: "P",
    invoiceUri: "",
    orderItems: [],
    statusMessage: "",
    timestamp: 1,
    invoiceNumbers: [],
  }) as never;

describe("home route loader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("aggregates counts and processes batches", async () => {
    mocks.parseCookie.mockResolvedValue("school.org");
    mocks.getCountByStatus
      .mockResolvedValueOnce({ success: true, data: 3 })
      .mockResolvedValueOnce({ success: true, data: 1 })
      .mockResolvedValueOnce({ success: true, data: 2 })
      .mockResolvedValueOnce({ success: false, data: 99 })
      .mockResolvedValueOnce({ success: true, data: 4 });
    mocks.getClaims.mockResolvedValue({
      success: true,
      data: [
        makeClaim("2024-01-02T10:00:00Z", "STORED"),
        makeClaim("2024-01-02T10:00:00Z", "SEND_ERROR"),
        makeClaim("2024-01-03T10:00:00Z", "PAID"),
      ],
    });

    const result = await loader({
      request: new Request("http://localhost/home"),
      params: {},
      context: {},
    } as never);

    expect(result.pendingOrders).toBe(3);
    expect(result.errorOrders).toBe(7);
    expect(result.totalOrders).toBe(10);
    expect(result.batches).toHaveLength(2);
    expect(result.batches[0].date).toBe("2024-01-03T10:00:00Z");
    expect(result.batches[1].errors).toBe(1);
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
