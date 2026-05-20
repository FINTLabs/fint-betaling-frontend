import { beforeEach, describe, expect, it, vi } from "vitest";
import { exportClaimsToCsv } from "./exportClaimsToCsv";

vi.mock("~/utils/variousFormats", () => ({
  formatCurrency: (value: unknown) => `NOK(${String(value)})`,
  formatDate: (value: unknown) => `DATE(${String(value)})`,
}));

const makeClaim = (overrides: Record<string, unknown> = {}) =>
  ({
    orderNumber: 101,
    claimStatus: "STORED",
    statusMessage: "",
    customerName: "Ola Nordmann",
    organisationUnit: { name: "Skole 1", organisationNumber: "school-1" },
    invoiceNumbers: ["INV-1", "INV-2"],
    originalAmountDue: 1200,
    amountDue: 1000,
    createdDate: "2024-01-01T10:00:00Z",
    orgId: "org",
    invoiceDate: null,
    paymentDueDate: null,
    requestedNumberOfDaysToPaymentDeadline: null,
    createdByEmployee: "EMP",
    principalCode: "P1",
    invoiceUri: "",
    orderItems: [],
    timestamp: 1,
    ...overrides,
  }) as never;

describe("exportClaimsToCsv", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("builds CSV with header, data rows and expected filename", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-20T12:00:00.000Z"));

    let capturedBlob: Blob | null = null;
    const createObjectURLMock = vi
      .spyOn(URL, "createObjectURL")
      .mockImplementation((blob: Blob) => {
        capturedBlob = blob;
        return "blob:mock-url";
      });
    const revokeObjectURLMock = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click");

    exportClaimsToCsv([
      makeClaim({
        customerName: 'Kari, "Test"',
        statusMessage: "Needs\nreview",
      }),
    ]);

    expect(createObjectURLMock).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLMock).toHaveBeenCalledWith("blob:mock-url");
    expect(clickSpy).toHaveBeenCalledTimes(1);

    const downloadLink = createObjectURLMock.mock.calls[0]?.[0];
    expect(downloadLink).toBeInstanceOf(Blob);

    const csvContent = await capturedBlob?.text();
    expect(csvContent).toBeDefined();
    expect(csvContent?.startsWith("Status,Navn,Skole,Ordrenummer")).toBe(true);
    expect(csvContent).toContain(
      "Status,Navn,Skole,Ordrenummer,Fakturanummer,Netto totalpris,Å betale,Opprettet",
    );
    expect(csvContent).toContain(
      '"STORED - Needs\nreview","Kari, ""Test""",Skole 1,101,"INV-1, INV-2",NOK(1200),NOK(1000),DATE(2024-01-01T10:00:00Z)',
    );
  });

  it("uses fallback values for missing invoice numbers and amount due", async () => {
    let capturedBlob: Blob | null = null;
    vi.spyOn(URL, "createObjectURL").mockImplementation((blob: Blob) => {
      capturedBlob = blob;
      return "blob:mock-url";
    });
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    exportClaimsToCsv([
      makeClaim({
        invoiceNumbers: [],
        amountDue: null,
        statusMessage: "",
      }),
    ]);

    const csvContent = await capturedBlob?.text();
    expect(csvContent).toContain(
      "STORED,Ola Nordmann,Skole 1,101,-,NOK(1200),-,DATE(2024-01-01T10:00:00Z)",
    );
  });
});
