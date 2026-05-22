import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ClaimHistoryTable } from "./ClaimHistoryTable";

vi.mock("~/utils/variousFormats", () => ({
  formatDate: (value: string) => `formatted-${value}`,
  formatCurrency: (value: number) => `currency-${value}`,
}));

vi.mock("./ClaimStatusBadge", () => ({
  ClaimStatusBadge: ({ claimStatus }: { claimStatus: string }) => (
    <span>{claimStatus}</span>
  ),
}));

vi.mock("@navikt/ds-react", () => {
  const Box = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

  const Checkbox = ({
    checked,
    onChange,
    onClick,
    disabled,
    readOnly,
    children,
  }: {
    checked?: boolean;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onClick?: React.MouseEventHandler<HTMLInputElement>;
    disabled?: boolean;
    readOnly?: boolean;
    children?: React.ReactNode;
  }) => (
    <label>
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={onChange ?? (() => {})}
        onClick={onClick}
        disabled={disabled}
        readOnly={readOnly}
        aria-label={typeof children === "string" ? children : undefined}
      />
      {children}
    </label>
  );

  const Table = ({ children }: { children: React.ReactNode }) => (
    <table>{children}</table>
  );
  Table.Header = ({ children }: { children: React.ReactNode }) => (
    <thead>{children}</thead>
  );
  Table.Body = ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>;
  Table.Row = ({
    children,
    onRowClick,
  }: {
    children: React.ReactNode;
    onRowClick?: React.MouseEventHandler<HTMLTableRowElement>;
  }) => <tr onClick={onRowClick}>{children}</tr>;
  Table.HeaderCell = ({ children }: { children: React.ReactNode }) => (
    <th>{children}</th>
  );
  Table.DataCell = ({ children, colSpan }: { children: React.ReactNode; colSpan?: number }) => (
    <td colSpan={colSpan}>{children}</td>
  );

  return { Box, Checkbox, Table };
});

const makeClaim = (overrides: Record<string, unknown>) =>
  ({
    orgId: "org",
    orderNumber: 101,
    createdDate: "2024-01-10T10:00:00Z",
    invoiceDate: null,
    paymentDueDate: null,
    amountDue: 1000,
    originalAmountDue: 2000,
    requestedNumberOfDaysToPaymentDeadline: null,
    customerName: "Ola Nordmann",
    createdByEmployee: "Anne",
    organisationUnit: { organisationNumber: "1", name: "Skole A" },
    principalCode: "P1",
    invoiceUri: "",
    orderItems: [],
    claimStatus: "STORED",
    statusMessage: "",
    timestamp: 1,
    invoiceNumbers: [],
    ...overrides,
  }) as never;

describe("ClaimHistoryTable", () => {
  it("renders empty state when there are no claims", () => {
    render(
      <ClaimHistoryTable
        claims={[]}
        selectedClaimIds={[]}
        onSelectAll={vi.fn()}
        onSelectClaim={vi.fn()}
        allSelected={false}
        someSelected={false}
        emptyMessage="Ingen treff"
      />,
    );

    expect(screen.getByText("Ingen treff")).toBeTruthy();
  });

  it("calls onSelectAll when header checkbox changes", () => {
    const onSelectAll = vi.fn();
    render(
      <ClaimHistoryTable
        claims={[makeClaim({})]}
        selectedClaimIds={[]}
        onSelectAll={onSelectAll}
        onSelectClaim={vi.fn()}
        allSelected={false}
        someSelected={false}
      />,
    );

    fireEvent.click(screen.getByLabelText("Velg alle"));
    expect(onSelectAll).toHaveBeenCalledWith(true);
  });

  it("groups claims by batch date and formats amount columns", () => {
    render(
      <ClaimHistoryTable
        claims={[
          makeClaim({ orderNumber: 101, createdDate: "2024-01-10T10:00:00Z" }),
          makeClaim({ orderNumber: 102, createdDate: "2024-01-10T10:00:00Z" }),
          makeClaim({ orderNumber: 103, createdDate: "2024-01-11T10:00:00Z" }),
        ]}
        selectedClaimIds={[]}
        onSelectAll={vi.fn()}
        onSelectClaim={vi.fn()}
        allSelected={false}
        someSelected={false}
      />,
    );

    expect(
      screen.getByText("Faktureringskjøring: formatted-2024-01-11T10:00:00Z (1 ordre)"),
    ).toBeTruthy();
    expect(
      screen.getByText("Faktureringskjøring: formatted-2024-01-10T10:00:00Z (2 ordrer)"),
    ).toBeTruthy();
    expect(screen.getAllByText("currency-2000").length).toBeGreaterThan(0);
    expect(screen.getAllByText("currency-1000").length).toBeGreaterThan(0);
  });

  it("only allows selectable rows to trigger row selection", () => {
    const onSelectClaim = vi.fn();
    render(
      <ClaimHistoryTable
        claims={[
          makeClaim({ orderNumber: 201, customerName: "Selectable", claimStatus: "STORED" }),
          makeClaim({ orderNumber: 202, customerName: "Locked", claimStatus: "PAID" }),
        ]}
        selectedClaimIds={[]}
        onSelectAll={vi.fn()}
        onSelectClaim={onSelectClaim}
        allSelected={false}
        someSelected={false}
      />,
    );

    fireEvent.click(screen.getByText("Selectable").closest("tr") as HTMLElement);
    fireEvent.click(screen.getByText("Locked").closest("tr") as HTMLElement);

    expect(onSelectClaim).toHaveBeenCalledTimes(1);
    expect(onSelectClaim).toHaveBeenCalledWith("201", true);
  });
});
