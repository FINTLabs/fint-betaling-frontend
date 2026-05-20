import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ClaimPending from "./claim-pending";

const mocks = vi.hoisted(() => ({
  useLoaderData: vi.fn(),
  submit: vi.fn(),
}));

vi.mock("~/api/MeApi", () => ({
  default: { fetchMe: vi.fn() },
}));

vi.mock("~/api/ClaimApi", () => ({
  default: {
    getClaims: vi.fn(),
    cancelClaim: vi.fn(),
    sendClaimsToSystem: vi.fn(),
  },
}));

vi.mock("~/utils/cookie", () => ({
  selectOrgCookie: { parse: vi.fn() },
}));

vi.mock("novari-frontend-components", () => ({
  NovariToaster: () => <div />,
  useAlerts: () => ({ alertState: [] }),
  NovariConfirmAction: ({
    buttonText,
    onConfirm,
  }: {
    buttonText: string;
    onConfirm: () => void;
  }) => <button onClick={onConfirm}>{buttonText}</button>,
}));

vi.mock("@navikt/ds-react", () => ({
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  HStack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  VStack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  TextField: ({
    label,
    value,
    onChange,
    placeholder,
  }: {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
  }) => (
    <label>
      {label}
      <input
        aria-label={label}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </label>
  ),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    useLoaderData: mocks.useLoaderData,
    useFetcher: () => ({ submit: mocks.submit, data: undefined, state: "idle" }),
  };
});

vi.mock("~/components/PageHeader", () => ({
  PageHeader: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

vi.mock("~/components/claim-history/ClaimHistoryTable", () => ({
  ClaimHistoryTable: ({
    claims,
    emptyMessage,
    onSelectClaim,
  }: {
    claims: Array<{ orderNumber: number }>;
    emptyMessage: string;
    onSelectClaim: (claimId: string, checked: boolean) => void;
  }) => (
    <div>
      <div>claims:{claims.length}</div>
      <div>{emptyMessage}</div>
      <button onClick={() => onSelectClaim("101", true)}>select-101</button>
    </div>
  ),
}));

const makeClaim = (orderNumber: number) =>
  ({
    orderNumber,
    claimStatus: "STORED",
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

describe("claim-pending route component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useLoaderData.mockReturnValue({
      pendingClaims: [makeClaim(101), makeClaim(202)],
    });
  });

  it("filters claims by order number search", () => {
    render(<ClaimPending />);

    expect(screen.getByText("claims:2")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Søk etter ordrenummer"), {
      target: { value: "101" },
    });
    expect(screen.getByText("claims:1")).toBeTruthy();
  });

  it("submits selected claims to factoring and clears selection", () => {
    render(<ClaimPending />);

    fireEvent.click(screen.getByText("select-101"));
    fireEvent.click(screen.getByText("SEND ORDRE TIL FAKTURERING"));

    expect(mocks.submit).toHaveBeenCalledTimes(1);
    const [submittedFormData, submitOptions] = mocks.submit.mock.calls[0];
    expect(submittedFormData.get("actionType")).toBe("SEND_TO_FACTORING");
    expect(submittedFormData.get("selectedClaims")).toBe('["101"]');
    expect(submitOptions).toEqual({ method: "post" });
  });

  it("shows delete confirm and submits DELETE_CLAIMS on confirm", () => {
    render(<ClaimPending />);

    fireEvent.click(screen.getByText("select-101"));
    fireEvent.click(screen.getByText("SLETT VALGTE"));

    expect(mocks.submit).toHaveBeenCalledTimes(1);
    const [submittedFormData, submitOptions] = mocks.submit.mock.calls[0];
    expect(submittedFormData.get("actionType")).toBe("DELETE_CLAIMS");
    expect(submittedFormData.get("selectedClaims")).toBe('["101"]');
    expect(submitOptions).toEqual({ method: "post" });
  });
});
