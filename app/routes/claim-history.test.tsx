import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ClaimHistory, { action, loader } from "./claim-history";

const mocks = vi.hoisted(() => ({
  parseCookie: vi.fn(),
  fetchMe: vi.fn(),
  getClaims: vi.fn(),
  sendClaimsToSystem: vi.fn(),
  useLoaderData: vi.fn(),
  submit: vi.fn(),
  setSearchParams: vi.fn(),
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

const MIN_USER = (orgId: string) => ({
  name: "Tester",
  employeeNumber: "1",
  organisation: { organisationNumber: orgId, name: "Org" },
  organisationUnits: [{ organisationNumber: orgId, name: "School" }],
  idleTime: 0,
  admin: false,
});

const actionRequest = (formData: FormData) =>
  ({
    request: new Request("http://localhost/historikk", {
      method: "POST",
      body: formData,
    }),
    params: {},
    context: {},
  }) as never;

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

const makeLoaderData = (overrides: Record<string, unknown> = {}) => ({
  claimHistory: [],
  user: {
    organisationUnits: [{ organisationNumber: "school-1", name: "School 1" }],
  },
  periodSelection: "WEEK",
  schoolSelection: "school-1",
  statusSelection: "",
  ...overrides,
});

describe("claim-history loader", () => {
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

describe("claim-history action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handles DOWNLOAD_SELECTED", async () => {
    const formData = new FormData();
    formData.append("actionType", "DOWNLOAD_SELECTED");
    formData.append("selectedClaims", JSON.stringify(["1", "2"]));
    mocks.parseCookie.mockResolvedValue("school.org");
    mocks.fetchMe.mockResolvedValue(MIN_USER("school.org"));

    const result = await action(actionRequest(formData));

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

    const result = await action(actionRequest(formData));

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

    const result = await action(actionRequest(formData));

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

    const result = await action(actionRequest(formData));

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

    const result = await action(actionRequest(formData));

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

    const result = await action(actionRequest(formData));

    expect(mocks.sendClaimsToSystem).not.toHaveBeenCalled();
    expect(result).toMatchObject({
      success: false,
      variant: "error",
    });
  });
});

describe("ClaimHistory component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useLoaderData.mockReturnValue(makeLoaderData());
  });

  it("shows empty-state message and hides paging when there are no claims", () => {
    render(<ClaimHistory />);

    expect(screen.getByText("Ordre historikk")).toBeTruthy();
    expect(screen.getByText("Ingen ordrer funnet")).toBeTruthy();
    expect(screen.queryByText("totalOrders:0")).toBeNull();
  });

  it("filters claims by order number search", () => {
    mocks.useLoaderData.mockReturnValue(
      makeLoaderData({
        claimHistory: [makeClaim(123, "STORED"), makeClaim(456, "SEND_ERROR")],
      }),
    );

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
    mocks.useLoaderData.mockReturnValue(
      makeLoaderData({
        claimHistory: [makeClaim(123, "STORED")],
      }),
    );

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
