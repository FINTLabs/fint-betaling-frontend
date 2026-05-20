import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ClaimHistory from "./claim-history";

const mocks = vi.hoisted(() => ({
  useLoaderData: vi.fn(),
  submit: vi.fn(),
  setSearchParams: vi.fn(),
}));

vi.mock("@navikt/ds-react", () => ({
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  HStack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Spacer: () => <div />,
  VStack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Search: ({
    label,
    value,
    onChange,
    placeholder,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
  }) => (
    <label>
      {label}
      <input
        aria-label={label}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  ),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    useLoaderData: mocks.useLoaderData,
    useFetcher: () => ({ submit: mocks.submit }),
    useSearchParams: () => [new URLSearchParams(), mocks.setSearchParams],
  };
});

vi.mock("~/components/PageHeader", () => ({
  PageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("~/components/claim-history/ClaimHistoryFilters", () => ({
  ClaimHistoryFilters: ({
    onDateFilterChange,
    onStatusFilterChange,
    onSchoolSelectionChange,
  }: {
    onDateFilterChange: (value: string) => void;
    onStatusFilterChange: (value: string) => void;
    onSchoolSelectionChange: (value: string) => void;
  }) => (
    <div>
      <button onClick={() => onDateFilterChange("MONTH")}>set-date</button>
      <button onClick={() => onStatusFilterChange("all")}>status-all</button>
      <button onClick={() => onSchoolSelectionChange("school-2")}>set-school</button>
    </div>
  ),
}));

vi.mock("~/components/claim-history/ClaimHistoryActions", () => ({
  ClaimHistoryActions: ({
    selectedCount,
    onResend,
  }: {
    selectedCount: number;
    onResend: () => void;
  }) => (
    <div>
      <div>selectedCount:{selectedCount}</div>
      <button onClick={onResend}>resend</button>
    </div>
  ),
}));

vi.mock("~/components/claim-history/ClaimHistoryTable", () => ({
  ClaimHistoryTable: ({
    claims,
    emptyMessage,
    onSelectClaim,
  }: {
    claims: Array<{ orderNumber: number }>;
    emptyMessage: string;
    onSelectClaim: (id: string, checked: boolean) => void;
  }) => (
    <div>
      <div>tableClaims:{claims.length}</div>
      <div>{emptyMessage}</div>
      <button onClick={() => onSelectClaim("123", true)}>select-123</button>
    </div>
  ),
}));

vi.mock("~/components/SelectAndPaging", () => ({
  SelectAndPaging: ({ totalOrders }: { totalOrders: number }) => (
    <div>totalOrders:{totalOrders}</div>
  ),
}));

const makeClaim = (orderNumber: number, claimStatus: string) =>
  ({
    orderNumber,
    claimStatus,
    createdDate: "2024-01-01",
    orgId: "org",
    invoiceDate: null,
    paymentDueDate: null,
    amountDue: 1000,
    originalAmountDue: 1000,
    requestedNumberOfDaysToPaymentDeadline: null,
    customerName: "A",
    createdByEmployee: "B",
    organisationUnit: { organisationNumber: "school-1", name: "School 1" },
    principalCode: "P",
    invoiceUri: "",
    orderItems: [],
    statusMessage: "",
    timestamp: 1,
    invoiceNumbers: [],
  }) as never;

describe("claim-history route component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useLoaderData.mockReturnValue({
      claimHistory: [],
      user: {
        organisationUnits: [{ organisationNumber: "school-1", name: "School 1" }],
      },
      periodSelection: "WEEK",
      schoolSelection: "school-1",
      statusSelection: "",
    });
  });

  it("shows empty-state message and hides paging when there are no claims", () => {
    render(<ClaimHistory />);

    expect(screen.getByText("Ordre historikk")).toBeTruthy();
    expect(screen.getByText("Ingen ordrer funnet")).toBeTruthy();
    expect(screen.queryByText("totalOrders:0")).toBeNull();
  });

  it("filters claims by order number search", () => {
    mocks.useLoaderData.mockReturnValue({
      claimHistory: [makeClaim(123, "STORED"), makeClaim(456, "SEND_ERROR")],
      user: {
        organisationUnits: [{ organisationNumber: "school-1", name: "School 1" }],
      },
      periodSelection: "WEEK",
      schoolSelection: "school-1",
      statusSelection: "",
    });

    render(<ClaimHistory />);
    expect(screen.getByText("tableClaims:2")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Søk på ordrenummer"), {
      target: { value: "123" },
    });
    expect(screen.getByText("tableClaims:1")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Søk på ordrenummer"), {
      target: { value: "999" },
    });
    expect(screen.getByText("Ingen ordrer matcher ordrenummeret")).toBeTruthy();
  });

  it("submits SEND_TO_FACTORING with selected ids and resets selection", () => {
    mocks.useLoaderData.mockReturnValue({
      claimHistory: [makeClaim(123, "STORED")],
      user: {
        organisationUnits: [{ organisationNumber: "school-1", name: "School 1" }],
      },
      periodSelection: "WEEK",
      schoolSelection: "school-1",
      statusSelection: "",
    });

    render(<ClaimHistory />);

    fireEvent.click(screen.getByText("select-123"));
    expect(screen.getByText("selectedCount:1")).toBeTruthy();

    fireEvent.click(screen.getByText("resend"));
    expect(mocks.submit).toHaveBeenCalledTimes(1);

    const [submittedFormData, submitOptions] = mocks.submit.mock.calls[0];
    expect(submittedFormData.get("actionType")).toBe("SEND_TO_FACTORING");
    expect(submittedFormData.get("selectedClaims")).toBe('["123"]');
    expect(submitOptions).toEqual({ method: "post" });
    expect(screen.getByText("selectedCount:0")).toBeTruthy();
  });

  it("updates query params through filter handlers", () => {
    render(<ClaimHistory />);

    fireEvent.click(screen.getByText("set-date"));
    fireEvent.click(screen.getByText("status-all"));
    fireEvent.click(screen.getByText("set-school"));

    expect(mocks.setSearchParams).toHaveBeenCalledTimes(3);

    const dateUpdater = mocks.setSearchParams.mock.calls[0][0];
    const statusUpdater = mocks.setSearchParams.mock.calls[1][0];
    const schoolUpdater = mocks.setSearchParams.mock.calls[2][0];

    const dateParams = new URLSearchParams();
    dateUpdater(dateParams);
    expect(dateParams.get("periodSelection")).toBe("MONTH");

    const statusParams = new URLSearchParams("status=STORED");
    statusUpdater(statusParams);
    expect(statusParams.get("status")).toBeNull();

    const schoolParams = new URLSearchParams();
    schoolUpdater(schoolParams);
    expect(schoolParams.get("schoolSelection")).toBe("school-2");
  });
});
